import os
import sys

from worker.web import app

def main() -> None:
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "5001"))
    is_frozen = getattr(sys, "frozen", False)
    debug = (os.environ.get("FLASK_DEBUG") == "1" or os.environ.get("DEBUG") == "1") and not is_frozen

    try:
        app.run(
            host=host,
            port=port,
            debug=debug,
            # PyInstaller + Werkzeug reloader is a bad combo (spawns new processes,
            # breaks onefile extraction, and produces confusing tracebacks).
            use_reloader=False,
        )
    except OSError as e:
        # Common case: port already in use.
        if getattr(e, "errno", None) in (48, 98):
            print(f"Port {port} is already in use. Set PORT to use a different one.")
            raise SystemExit(1) from e
        raise


if __name__ == "__main__":
    main()
