from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from .db import get_collections_from_db

bp_db_gateway = Blueprint('DatabaseAPI', __name__, url_prefix='/DatabaseAPI')


@bp_db_gateway.route('/get/collections', methods=['GET'])
def get_collections():
    return get_collections_from_db()
