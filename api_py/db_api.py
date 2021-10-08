from flask import Flask, make_response, request
from flask.json import dumps
from flask_restful import Api, Resource
import json
from timer import Timer

app = Flask(__name__)
api = Api(app)

db = {}
with open('db.json', encoding='utf-8') as json_file:
    db = json.load(json_file)

subscriptions = {'1': 60, '5': 300, '10': 600}
active_subscriptions = {}


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


class Subscription(Resource):
    def get(self):
        id = request.args.get("id")
        if id in active_subscriptions:
            user_subscription = active_subscriptions[id]
            return make_response({"time": user_subscription["timer"].get_time(),
                                  "subscription": int(user_subscription["subscription"]),
                                  "autoRenovation": user_subscription["autoRenovation"] == 'true'},
                                 {"Access-Control-Allow-Origin": '*'})
        else:
            return make_response("No existe ese id", 404,
                                 {"Access-Control-Allow-Origin": '*'})

    def post(self):
        id = request.args.get("id")
        subscription = request.args.get("subscription")
        auto_renovation = request.args.get("autoRenovation")

        if id not in active_subscriptions:
            timer = Timer(subscriptions[subscription])
            timer.count_down()
            active_subscriptions[id] = {"timer": timer, "subscription": subscription,
                                        "autoRenovation": auto_renovation}
            return make_response({"time": timer.get_time()},
                                 {"Access-Control-Allow-Origin": '*'}
                                 )

        elif active_subscriptions[id]["timer"].get_time() == 0:
            timer = active_subscriptions[id]["timer"]
            timer.set_time(subscriptions[subscription])
            timer.count_down()
            active_subscriptions[id]["subscription"] = subscription
            active_subscriptions[id]["autoRenovation"] = auto_renovation
            return make_response({"time": timer.get_time()},
                                 {"Access-Control-Allow-Origin": '*'}
                                 )
        else:
            return make_response("Ya existe esa suscripción", 409,
                                 {"Access-Control-Allow-Origin": '*'})


api.add_resource(UserProfile, "/userprofile")
api.add_resource(Lessons, "/lessons")
api.add_resource(Instructor, "/instructor/<int:id>")
api.add_resource(Subscription, "/subscription")

if __name__ == "__main__":
    app.run(debug=False)
