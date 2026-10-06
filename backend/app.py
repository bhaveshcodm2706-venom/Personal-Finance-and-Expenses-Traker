from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

transactions = []


# Test API
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Personal Finance Tracker Python Backend is running!"
    })


# Get all transactions
@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    return jsonify(transactions)


# Add transaction
@app.route("/api/transactions", methods=["POST"])
def add_transaction():

    data = request.get_json()

    transaction = {
        "id": len(transactions) + 1,
        "type": data.get("type"),
        "title": data.get("title"),
        "amount": float(data.get("amount", 0)),
        "category": data.get("category"),
        "date": data.get("date")
    }

    transactions.append(transaction)

    return jsonify({
        "message": "Transaction added successfully",
        "transaction": transaction
    }), 201


# Delete transaction
@app.route("/api/transactions/<int:id>", methods=["DELETE"])
def delete_transaction(id):

    global transactions

    for transaction in transactions:
        if transaction["id"] == id:

            transactions.remove(transaction)

            return jsonify({
                "message": "Transaction deleted successfully"
            })

    return jsonify({
        "message": "Transaction not found"
    }), 404


# Summary
@app.route("/api/summary", methods=["GET"])
def summary():

    total_income = 0
    total_expenses = 0

    for transaction in transactions:

        if transaction["type"] == "Income":
            total_income += transaction["amount"]

        elif transaction["type"] == "Expense":
            total_expenses += transaction["amount"]

    balance = total_income - total_expenses

    return jsonify({
        "income": income,
        "expenses":expenses,
        "balance": balance
    })


if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )