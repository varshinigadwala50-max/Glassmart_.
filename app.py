import os
import sqlite3
import uuid
import json

import pandas as pd
import numpy as np
import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import plotly.express as px

from flask import (
    Flask, render_template, request,
    redirect, url_for, flash, jsonify, send_from_directory
)
from werkzeug.utils import secure_filename


# ---------------- APP CONFIGURATION ----------------

app = Flask(__name__)

app.secret_key = "glassmart-development-key"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "glassmart.db")

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
CHART_FOLDER = os.path.join(BASE_DIR, "static", "charts")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CHART_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"csv"}


# ---------------- DATABASE ----------------

def get_db():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_database():

    connection = get_db()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS app_state (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            data TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            file_type TEXT NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            row_count INTEGER DEFAULT 0,
            data TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


create_database()


# ---------------- FILE VALIDATION ----------------

def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


# ---------------- CSV PROCESSING ----------------

def clean_columns(df):

    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    return df


def save_upload(df, filename, file_type):

    connection = get_db()

    data_json = df.to_json(orient="records", date_format="iso")

    connection.execute("""
        INSERT INTO uploads
        (filename, file_type, row_count, data)
        VALUES (?, ?, ?, ?)
    """, (
        filename,
        file_type,
        len(df),
        data_json
    ))

    connection.commit()
    connection.close()


def get_latest_data(file_type):

    connection = get_db()

    record = connection.execute("""
        SELECT data
        FROM uploads
        WHERE file_type = ?
        ORDER BY id DESC
        LIMIT 1
    """, (file_type,)).fetchone()

    connection.close()

    if record is None:
        return pd.DataFrame()

    return pd.DataFrame(json.loads(record["data"]))


# ---------------- ANALYTICS ----------------

def calculate_metrics():

    sales = get_latest_data("sales")

    if sales.empty:
        return {
            "revenue": 0,
            "orders": 0,
            "aov": 0,
            "quantity": 0
        }

    if "line_total" in sales.columns:
        sales["line_total"] = pd.to_numeric(
            sales["line_total"], errors="coerce"
        ).fillna(0)
    else:
        sales["line_total"] = 0

    if "qty" in sales.columns:
        sales["qty"] = pd.to_numeric(
            sales["qty"], errors="coerce"
        ).fillna(0)
    else:
        sales["qty"] = 0

    revenue = float(sales["line_total"].sum())

    if "order_id" in sales.columns:
        orders = int(sales["order_id"].nunique())
    else:
        orders = 0

    quantity = int(sales["qty"].sum())

    aov = revenue / orders if orders else 0

    return {
        "revenue": round(revenue, 2),
        "orders": orders,
        "aov": round(aov, 2),
        "quantity": quantity
    }


# ---------------- PLOTLY CHART ----------------

def create_plotly_chart():

    sales = get_latest_data("sales")

    if sales.empty or "product" not in sales.columns:
        return None

    sales["line_total"] = pd.to_numeric(
        sales["line_total"], errors="coerce"
    ).fillna(0)

    category_data = (
        sales.groupby("product")["line_total"]
        .sum()
        .reset_index()
        .sort_values("line_total", ascending=False)
    )

    fig = px.bar(
        category_data,
        x="product",
        y="line_total",
        title="Revenue by Product",
        labels={
            "product": "Product",
            "line_total": "Revenue (₹)"
        }
    )

    return fig.to_html(
        full_html=False,
        include_plotlyjs="cdn"
    )


# ---------------- MATPLOTLIB CHART ----------------

def create_matplotlib_chart():

    sales = get_latest_data("sales")

    if sales.empty:
        return

    if "product" not in sales.columns:
        return

    sales["line_total"] = pd.to_numeric(
        sales["line_total"], errors="coerce"
    ).fillna(0)

    product_revenue = (
        sales.groupby("product")["line_total"]
        .sum()
        .sort_values(ascending=False)
    )

    plt.figure(figsize=(9, 5))

    product_revenue.plot(kind="bar")

    plt.title("Product Revenue Analysis")
    plt.xlabel("Product")
    plt.ylabel("Revenue (₹)")
    plt.xticks(rotation=35, ha="right")
    plt.tight_layout()

    chart_path = os.path.join(
        CHART_FOLDER, "revenue.png"
    )

    plt.savefig(chart_path)
    plt.close()


# ---------------- DASHBOARD ROUTE ----------------

@app.route("/")
def shop():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/css/<path:filename>")
def css_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, "css"), filename)


@app.route("/js/<path:filename>")
def js_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, "js"), filename)


@app.route("/vendor/<path:filename>")
def vendor_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, "vendor"), filename)


@app.route("/analytics")
def dashboard():

    metrics = calculate_metrics()

    plotly_chart = create_plotly_chart()

    create_matplotlib_chart()

    inventory = get_latest_data("inventory")

    product_count = len(inventory)

    low_stock = 0

    if not inventory.empty and "stock_left" in inventory.columns:

        stock = pd.to_numeric(
            inventory["stock_left"], errors="coerce"
        ).fillna(0)

        low_stock = int((stock <= 5).sum())

    return render_template(
        "analytics.html",
        metrics=metrics,
        chart=plotly_chart,
        product_count=product_count,
        low_stock=low_stock
    )


# ---------------- CSV UPLOAD ROUTE ----------------

@app.route("/upload", methods=["POST"])
def upload():

    if "file" not in request.files:
        flash("Please select a CSV file.")
        return redirect(url_for("dashboard"))

    file = request.files["file"]

    file_type = request.form.get("file_type", "")

    if file.filename == "":
        flash("No file selected.")
        return redirect(url_for("dashboard"))

    if not allowed_file(file.filename):
        flash("Only CSV files are supported.")
        return redirect(url_for("dashboard"))

    if file_type not in ["sales", "inventory"]:
        flash("Choose a valid data type.")
        return redirect(url_for("dashboard"))

    try:

        df = pd.read_csv(file)

        if df.empty:
            flash("The uploaded CSV is empty.")
            return redirect(url_for("dashboard"))

        df = clean_columns(df)

        if file_type == "sales":

            required = {
                "date", "order_id", "product",
                "qty", "line_total", "order_status"
            }

            if not required.issubset(df.columns):
                flash(
                    "Sales CSV must contain: Date, Order ID, "
                    "Product, Qty, Line total and Order status."
                )
                return redirect(url_for("dashboard"))

            df = df[
                df["order_status"].astype(str).str.lower()
                != "cancelled"
            ].copy()

            df["line_total"] = pd.to_numeric(
                df["line_total"], errors="coerce"
            ).fillna(0)

            df["qty"] = pd.to_numeric(
                df["qty"], errors="coerce"
            ).fillna(0)

            if (df["line_total"] < 0).any() or (df["qty"] < 0).any():
                flash("Sales data cannot contain negative amounts or quantities.")
                return redirect(url_for("dashboard"))

        elif file_type == "inventory":

            required = {"product_id", "name", "category", "stock_left"}

            if not required.issubset(df.columns):
                flash(
                    "Inventory CSV must contain: Product ID, "
                    "Name, Category and Stock left."
                )
                return redirect(url_for("dashboard"))

        filename = secure_filename(file.filename)

        save_upload(df, filename, file_type)

        flash("CSV uploaded and processed successfully!")

    except Exception as error:

        flash(f"Could not process CSV: {error}")

    return redirect(url_for("dashboard"))


# ---------------- SHARED GLASSMART APP DATA ----------------

@app.route("/api/state", methods=["GET", "POST"])
def shared_state():
    """Shared demo state for all browsers connected to this Flask server.

    This is a classroom/demo sync layer. Before public production use,
    replace it with authenticated, role-checked per-resource APIs.
    """
    connection = get_db()
    if request.method == "GET":
        row = connection.execute("SELECT data FROM app_state WHERE id = 1").fetchone()
        connection.close()
        return jsonify({"state": json.loads(row["data"]) if row else None})

    payload = request.get_json(silent=True) or {}
    state = payload.get("state")
    if not isinstance(state, dict) or not all(k in state for k in ("users", "products", "orders", "reviews", "carts")):
        connection.close()
        return jsonify({"error": "Invalid GlassMart state"}), 400
    data = json.dumps(state, separators=(",", ":"))
    connection.execute("""
        INSERT INTO app_state (id, data, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP
    """, (data,))
    connection.commit()
    connection.close()
    return jsonify({"ok": True})


# ---------------- API ----------------

@app.route("/api/metrics")
def api_metrics():

    return jsonify(calculate_metrics())


# ---------------- RUN SERVER ----------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )