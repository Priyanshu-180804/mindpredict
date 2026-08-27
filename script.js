const form = document.getElementById("predictionForm");

const predictButton = document.getElementById("predictButton");

const resultBox = document.getElementById("resultBox");
const errorBox = document.getElementById("errorBox");

const predictionScore = document.getElementById("predictionScore");
const resultMessage = document.getElementById("resultMessage");
const errorMessage = document.getElementById("errorMessage");

const scoreProgress = document.getElementById("scoreProgress");


// Your FastAPI backend URL
const API_URL = "https://mindpredict.onrender.com";


form.addEventListener("submit", async function (event) {

    event.preventDefault();


    // Hide previous result and error
    resultBox.classList.add("hidden");
    errorBox.classList.add("hidden");


    // Collect data in exactly the format required by FastAPI
    const data = {

        Age: Number(
            document.getElementById("age").value
        ),

        Gender:
            document.getElementById("gender").value,

        Country:
            document.getElementById("country").value,

        Academic_Level:
            document.getElementById("academicLevel").value,

        Most_Used_Platform:
            document.getElementById("platform").value,

        Purpose_Of_Use:
            document.getElementById("purpose").value,

        Avg_Daily_Usage_Hours:
            Number(
                document.getElementById("usageHours").value
            ),

        Daily_Unlocks:
            Number(
                document.getElementById("dailyUnlocks").value
            ),

        Study_Hours:
            Number(
                document.getElementById("studyHours").value
            ),

        Physical_Activity_Hours:
            Number(
                document.getElementById("physicalActivity").value
            ),

        Sleep_Hours_Per_Night:
            Number(
                document.getElementById("sleepHours").value
            ),

        Stress_Level:
            document.getElementById("stressLevel").value
    };


    // Start loading animation
    predictButton.disabled = true;
    predictButton.classList.add("loading");


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });


        const result = await response.json();


        // Handle FastAPI validation errors
        if (!response.ok) {

            let message =
                "Please check your input and try again.";


            if (result.detail) {

                if (Array.isArray(result.detail)) {

                    message = result.detail
                        .map(function (error) {
                            return error.msg;
                        })
                        .join(", ");

                } else {

                    message = result.detail;

                }

            }


            throw new Error(message);
        }


        // Get prediction from backend
        const score =
            Number(
                result.predicted_mental_health_score
            );


        // Display result
        predictionScore.textContent =
            score.toFixed(2);


        // Generate result message
        resultMessage.textContent =
            getResultMessage(score);


        // Show result box
        resultBox.classList.remove("hidden");


        // Animate score circle
        animateScoreCircle(score);


        // Scroll to result
        setTimeout(function () {

            resultBox.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 200);


    } catch (error) {

        console.error(error);


        errorMessage.textContent =
            error.message ||
            "Unable to connect to the backend. Make sure FastAPI is running.";


        errorBox.classList.remove("hidden");


        errorBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } finally {

        predictButton.disabled = false;
        predictButton.classList.remove("loading");

    }

});



/* =====================================
   SCORE CIRCLE ANIMATION
===================================== */

function animateScoreCircle(score) {

    const radius = 70;

    const circumference =
        2 * Math.PI * radius;


    // Reset circle
    scoreProgress.style.strokeDasharray =
        circumference;

    scoreProgress.style.strokeDashoffset =
        circumference;


    /*
      If your model score is between 0 and 100,
      this will work directly.

      If your model returns another range,
      adjust this value.
    */

    let percentage = score;


    // Keep percentage between 0 and 100
    percentage = Math.max(
        0,
        Math.min(100, percentage)
    );


    const offset =
        circumference -
        (percentage / 100) * circumference;


    // Start animation after result appears
    setTimeout(function () {

        scoreProgress.style.strokeDashoffset =
            offset;

    }, 100);

}



/* =====================================
   RESULT MESSAGE
===================================== */

function getResultMessage(score) {

    if (score >= 80) {

        return "Your predicted score is relatively high. Keep maintaining positive habits such as good sleep, physical activity, balanced social media usage, and healthy daily routines.";

    }

    else if (score >= 60) {

        return "Your predicted score is moderate. A balanced lifestyle, good sleep, stress management, and healthy social media habits may help improve your overall well-being.";

    }

    else if (score >= 40) {

        return "Your predicted score suggests that improving your daily routine, sleep, stress management, physical activity, and screen time balance may be helpful.";

    }

    else {

        return "Your predicted score is relatively low. Consider focusing on healthy routines and reaching out to a qualified mental health professional if you are experiencing emotional or mental health difficulties.";

    }

}