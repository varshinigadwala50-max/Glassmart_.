GLASSMART - UPDATED LOCAL VERSION

1. Install Python 3 if it is not already installed.
2. Open this folder in VS Code.
3. Open Terminal > New Terminal.
4. Run: python -m pip install -r requirements.txt
5. Run: python app.py
6. Open: http://127.0.0.1:5000

IMPORTANT:
- Do NOT open index.html using file://. Use the Flask address above.
- The shop now loads/saves its shared demo data through /api/state in glassmart.db.
- To test on another device on the SAME Wi-Fi, open http://YOUR-COMPUTER-LAN-IP:5000 on that device while app.py is running. Allow Python through Windows Firewall if asked.
- GitHub Pages cannot run Flask. For public access from anywhere, deploy this Flask app to a Python host and use persistent database + image storage.
- This update adds shared demo-state synchronization, not production-grade security. The existing front-end authentication is still client-side. Do not use real customer data or expose this demo publicly until authentication and role permissions are moved to secure server-side APIs.
- Analytics dashboard: http://127.0.0.1:5000/analytics
