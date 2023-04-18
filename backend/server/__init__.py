# contains application factory
# tells Python that server shoul be threated as a package

import os

from flask import Flask

def create_app(test_config=None):
    #create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    #sets default configuration that the app will use
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'WorldCollectionDatabase.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # add database init command to app
    from .Database.Database_operations import db_initiazition
    db_initiazition.init_app(app)
    
    # register Wikidata API blueprint to app
    from .API import WikidataAPI
    app.register_blueprint(WikidataAPI.API)

    # register database gateway to app
    from .Database.Gateway import db_gateway
    app.register_blueprint(db_gateway.bp_database_gateway)

    return app