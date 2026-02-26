import os

from worker.web import app

def main() -> None:
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "5001"))
    debug = os.environ.get("FLASK_DEBUG", "1") == "1"

    app.run(host=host, port=port, debug=debug)


if __name__ == "__main__":
    main()
