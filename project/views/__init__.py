def init_app(app):
    from .home import home_bp

    app.register_blueprint(home_bp)
