def init_app(app):
    from .game import game_bp

    app.register_blueprint(game_bp)
