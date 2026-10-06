// ==========================================
// PYTHON BACKEND URL
// ==========================================

// During local testing:
// const API_URL = "http://127.0.0.1:5000";

// After deploying your Python backend,
// replace this with your backend URL.

const API_URL =  "https://personal-finance-expense-api.onrender.com";


// ==========================================
// PAGE INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

    loadTransactions();
    loadSummary();

});


// ==========================================
// ADD TRANSACTION
// ==========================================

document
    .getElementById("transactionForm")
    .addEventListener("submit", async (event) => {

        event.preventDefault();

        const transaction = {

            type:
                document.getElementById("type").value,

            title:
                document.getElementById("title").value,

            amount:
                document.getElementById("amount").value,

            category:
                document.getElementById("category").value,

            date:
                document.getElementById("date").value
        };


        try {

            const response = await fetch(
                `${API_URL}/api/transactions`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(transaction)
                }
            );


            const result = await response.json();


            if (!response.ok) {

                alert(result.error);

                return;

            }


            alert(
                "Transaction added successfully!"
            );


            document
                .getElementById("transactionForm")
                .reset();


            document.getElementById("date").value =
                new Date()
                    .toISOString()
                    .split("T")[0];


            loadTransactions();
            loadSummary();

        }

        catch (error) {

            console.error(error);

            alert(
                "Cannot connect to Python backend."
            );

        }

    });


// ==========================================
// LOAD TRANSACTIONS
// ==========================================

async function loadTransactions() {

    try {

        const response = await fetch(
            `${API_URL}/api/transactions`
        );


        const transactions =
            await response.json();


        const table =
            document.getElementById(
                "transactionTable"
            );


        table.innerHTML = "";


        transactions.forEach(transaction => {

            const row =
                document.createElement("tr");


            const typeClass =
                transaction.type === "income"
                    ? "income-text"
                    : "expense-text";


            row.innerHTML = `

                <td>
                    ${transaction.date}
                </td>

                <td>
                    ${transaction.title}
                </td>

                <td>
                    ${transaction.category}
                </td>

                <td class="${typeClass}">
                    ${transaction.type}
                </td>

                <td class="${typeClass}">
                    ₹${Number(
                        transaction.amount
                    ).toFixed(2)}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(
                            ${transaction.id}
                        )">

                        Delete

                    </button>

                </td>

            `;


            table.appendChild(row);

        });

    }

    catch (error) {

        console.error(
            "Error loading transactions:",
            error
        );

    }

}


// ==========================================
// DELETE TRANSACTION
// ==========================================

async function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        await fetch(
            `${API_URL}/api/transactions/${id}`,
            {
                method: "DELETE"
            }
        );


        loadTransactions();
        loadSummary();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete transaction."
        );

    }

}


// ==========================================
// LOAD SUMMARY
// ==========================================

async function loadSummary() {

    try {

        const response = await fetch(
            `${API_URL}/api/summary`
        );


        const data =
            await response.json();


        document.getElementById(
            "totalIncome"
        ).textContent =
            "₹" +
            Number(data.income).toFixed(2);


        document.getElementById(
            "totalExpense"
        ).textContent =
            "₹" +
            Number(data.expenses).toFixed(2);


        document.getElementById(
            "currentBalance"
        ).textContent =
            "₹" +
            Number(data.balance).toFixed(2);

    }

    catch (error) {

        console.error(
            "Error loading summary:",
            error
        );

    }

}