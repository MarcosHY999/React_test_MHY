from flask import Flask, make_response
from flask.json import dumps
from flask_restful import Api, Resource
import json

app = Flask(__name__)
api = Api(app)

db = {}
with open('db.json', encoding='utf-8') as json_file:
    db = json.load(json_file)


class UserProfile(Resource):
    def get(self):
        return make_response(db["profile"],
                             {"Access-Control-Allow-Origin": '*'})


class Lessons(Resource):
    def get(self):
        return make_response(json.dumps(db["training_classes"]),
                             {"Access-Control-Allow-Origin": '*'})


class Instructor(Resource):
    def get(self, id):
        name = "N/A"
        for instructor in db["instructors"]:
            if instructor["id"] == id:
                name = instructor["name"]
                break

        return make_response(name,
                             {"Access-Control-Allow-Origin": '*'})


api.add_resource(UserProfile, "/userprofile")
api.add_resource(Lessons, "/lessons")
api.add_resource(Instructor, "/instructor/<int:id>")

if __name__ == "__main__":
    app.run(debug=True)
