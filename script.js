const questionsTest1 = [
  {
    question: "محمد اشترى 12 تفاحة وأعطى 5 تفاحات لصديقه، كم تفاحة تبقت لديه؟",
    options: ["5", "6", "7", "8"],
    correctAnswer: "7",
  },
  {
    question: "إذا كان كل صندوق يحتوي على 4 كتب، كم كتاباً في 6 صناديق؟",
    options: ["20", "24", "18", "30"],
    correctAnswer: "24",
  },
  {
    question: "قسّم 45 على 9 تساوي ____.",
    type: "fill-in-the-blank",
    correctAnswer: "5",
  },
];

let currentTest = 0;
let currentQuestionIndex = 0; // مؤشر السؤال الحالي
let score = 0; // درجة المستخدم
let userAnswers = []; // تخزين إجابات المستخدم
let timerInterval; // متغير لتخزين معرف المؤقت

const welcomeContainer = document.querySelector(".welcome-container"); // عنصر يحتوي على شاشة الترحيب
const formContainer = document.querySelector(".form-container"); // عنصر يحتوي على الفورم
const testSelectionContainer = document.querySelector(
  ".test-selection-container"
); // عنصر يحتوي على قائمة الاختبارات
const questionsContainer = document.getElementById("questions-container"); // عنصر يحتوي على الأسئلة
const nextButton = document.getElementById("next-button"); // زر الانتقال للسؤال التالي
const previousButton = document.getElementById("previous-button"); // زر الانتقال للسؤال السابق
const resultContainer = document.getElementById("result"); // عنصر لعرض النتيجة النهائية
const timerElement = document.getElementById("timer"); // عنصر لعرض المؤقت

// إخفاء شاشة الترحيب بعد 3 ثواني وعرض الفورم
setTimeout(() => {
  const storedUsername = localStorage.getItem("username");
  if (!storedUsername) {
    welcomeContainer.classList.add("hidden");
    setTimeout(() => {
      welcomeContainer.style.display = "none";
      formContainer.style.display = "block";
      formContainer.classList.add("visible");
    }, 1300); // تأخير لإخفاء شاشة الترحيب بشكل كامل
  } else {
    // إذا كان اسم المستخدم موجودًا، الانتقال مباشرة إلى قائمة الاختبارات
    welcomeContainer.style.display = "none";
    testSelectionContainer.style.display = "block";
    testSelectionContainer.classList.add("visible");
  }
}, 1500);

document.getElementById("user-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const namePattern = /^[a-zA-Z\u0600-\u06FF\s]+$/; // نمط للتحقق من أن الاسم يحتوي على حروف فقط (عربية أو إنجليزية)

  if (!namePattern.test(username)) {
    alert("الرجاء إدخال اسم صحيح بدون أرقام.");
    return;
  }

  localStorage.setItem("username", username); // حفظ اسم المستخدم في الذاكرة الداخلية

  formContainer.style.display = "none"; // إخفاء الفورم بدون أنيميشن
  testSelectionContainer.style.display = "block"; // عرض قائمة الاختبارات
  testSelectionContainer.classList.add("visible");

  // تحديث حالة الامتحانات من الذاكرة الداخلية
  updateTestStatus();
});

function goBackToSelection() {
  location.reload(); // إعادة تحميل الصفحة
}

function startTest(testNumber) {
  currentTest = testNumber;
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  document.body.classList.add("no-background"); // إزالة الخلفية
  testSelectionContainer.style.display = "none"; // إخفاء قائمة الاختبارات
  const container = document.querySelector(".container");
  container.style.display = "block";
  container.classList.add("visible");
  document.getElementById("back-to-selection-button").style.display = "block"; // عرض زر العودة
  startTimer(60 * 60); // بدء المؤقت لمدة ساعة واحدة (3600 ثانية)
  showQuestion(currentQuestionIndex);
}

function startTimer(duration) {
  let timer = duration,
    minutes,
    seconds;
  timerInterval = setInterval(() => {r
    minutes = parseInt(timer / 250, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElement.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(timerInterval);
      showResult(); // عرض النتيجة النهائية عند انتهاء الوقت
    }
  }, 1000);
}

function showQuestion(index) {
  questionsContainer.innerHTML = ""; // تفريغ محتوى عنصر الأسئلة
  const questions =
    currentTest === 1
      ? questionsTest1
      : currentTest === 2
      ? questionsTest2
      : currentTest === 3
      ? questionsTest3
      : currentTest === 4
      ? questionsTest4
      : currentTest === 5
      ? questionsTest5
      : currentTest === 6
      ? questionsTest6
      : questionsTest7; // إضافة الاختبارات الجديدة
  const question = questions[index]; // الحصول على السؤال الحالي
  const questionDiv = document.createElement("div"); // إنشاء عنصر جديد للسؤال
  questionDiv.classList.add("question"); // إضافة فئة CSS للسؤال

  const questionTitle = document.createElement("h2"); // إنشاء عنصر لعنوان السؤال
  questionTitle.textContent = question.question; // تعيين نص السؤال
  questionTitle.style.textAlign = "center"; // محاذاة النص إلى الوسط
  questionDiv.appendChild(questionTitle); // إضافة عنوان السؤال إلى عنصر السؤال

  if (question.type === "fill-in-the-blank") {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "اكتب إجابتك هنا";
    input.style.display = "block"; // عرض الحقل ككتلة
    input.style.margin = "20px auto"; // تباعد داخلي للحقل
    input.style.padding = "10px"; // تباعد داخلي للحقل
    input.style.width = "80%"; // عرض الحقل
    input.style.borderRadius = "4px"; // حواف دائرية للحقل
    input.style.border = "1px solid #ccc"; // حدود الحقل
    input.value = userAnswers[index] || ""; // استرجاع الإجابة السابقة إذا كانت موجودة
    input.addEventListener("input", () => {
      userAnswers[index] = input.value; // تخزين إجابة المستخدم
      nextButton.disabled = !input.value.trim(); // تعطيل الزر إذا لم يتم إدخال إجابة
    });
    questionDiv.appendChild(input);
  } else {
    const optionsDiv = document.createElement("div"); // إنشاء عنصر جديد للخيارات
    optionsDiv.classList.add("options"); // إضافة فئة CSS للخيارات

    question.options.forEach((option) => {
      const button = document.createElement("button"); // إنشاء زر لكل خيار
      button.textContent = option; // تعيين نص الخيار
      if (userAnswers[index] === option) {
        button.classList.add("selected"); // تحديد الإجابة السابقة إذا كانت موجودة
      }
      button.addEventListener("click", () => {
        // إضافة مستمع للنقر على الزر
        userAnswers[index] = option; // تخزين إجابة المستخدم
        document.querySelectorAll(".options button").forEach((btn) => {
          btn.classList.remove("selected"); // إزالة الفئة من جميع الأزرار
        });
        button.classList.add("selected"); // إضافة الفئة للزر المحدد
        nextButton.disabled = false; // تمكين زر "السؤال التالي"
      });
      optionsDiv.appendChild(button); // إضافة الزر إلى عنصر الخيارات
    });

    questionDiv.appendChild(optionsDiv); // إضافة عنصر الخيارات إلى عنصر السؤال
  }

  questionsContainer.appendChild(questionDiv); // إضافة عنصر السؤال إلى عنصر الأسئلة

  // عرض زر "السؤال السابق" إذا لم يكن السؤال الأول
  previousButton.style.display = index > 0 ? "block" : "none";

  // تمكين أو تعطيل زر "السؤال التالي" بناءً على الإجابة
  nextButton.disabled = !userAnswers[index];
  nextButton.style.display = "block"; // التأكد من أن الزر ظاهر دائمًا
}

previousButton.addEventListener("click", () => {
  // التأكد من أن المؤشر أكبر من الصفر
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--; // تقليل المؤشر بمقدار واحد
    showQuestion(currentQuestionIndex); // عرض السؤال بناءً على المؤشر الجديد
  }
});

nextButton.addEventListener("click", () => {
  // إضافة مستمع للنقر على زر "السؤال التالي"
  const questions =
    currentTest === 1
      ? questionsTest1
      : currentTest === 2
      ? questionsTest2
      : currentTest === 3
      ? questionsTest3
      : currentTest === 4
      ? questionsTest4
      : currentTest === 5
      ? questionsTest5
      : currentTest === 6
      ? questionsTest6
      : questionsTest7;

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++; // زيادة مؤشر السؤال الحالي بمقدار واحد
    showQuestion(currentQuestionIndex); // عرض السؤال التالي بناءً على المؤشر الجديد
  } else {
    showResult(); // عرض النتيجة النهائية إذا كان المستخدم في آخر سؤال
  }
});

function showResult() {
  clearInterval(timerInterval); // إيقاف المؤقت
  questionsContainer.style.display = "none"; // إخفاء عنصر الأسئلة
  nextButton.style.display = "none"; // إخفاء زر الانتقال للسؤال التالي
  previousButton.style.display = "none"; // إخفاء زر السؤال السابق
  document.getElementById("back-to-selection-button").style.display = "none"; // إخفاء زر الرجوع إلى القائمة الرئيسية
  resultContainer.style.display = "block"; // عرض عنصر النتيجة النهائية

  let resultHTML = `<h2>نتائج الاختبار</h2>`;
  const questions =
    currentTest === 1
      ? questionsTest1
      : currentTest === 2
      ? questionsTest2
      : currentTest === 3
      ? questionsTest3
      : currentTest === 4
      ? questionsTest4
      : currentTest === 5
      ? questionsTest5
      : currentTest === 6
      ? questionsTest6
      : questionsTest7;
  questions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const correctAnswer = question.correctAnswer;
    const isCorrect = userAnswer === correctAnswer;
    if (isCorrect) score++;
    resultHTML += `
      <div class="result-question">
        <h3>${question.question}</h3>
        <p>إجابتك: ${userAnswer} ${isCorrect ? "(صحيحة)" : "(خاطئة)"}</p>
        ${!isCorrect ? `<p>الإجابة الصحيحة: ${correctAnswer}</p>` : ""}
      </div>
    `;
  });

  resultHTML += `<p>لقد أجبت بشكل صحيح على ${score} من ${questions.length} أسئلة.</p>`;
  resultContainer.innerHTML = resultHTML;

  const submitButton = document.createElement("button");
  submitButton.id = "submit-button";
  submitButton.textContent = "تسليم الاختبار";
  submitButton.addEventListener("click", handleSubmit);
  resultContainer.appendChild(submitButton);

  const backButton = document.createElement("button");
  backButton.id = "back-to-main-menu-button";
  backButton.textContent = "الرجوع إلى القائمة الرئيسية";
  backButton.style.backgroundColor = "#ffcc00"; // لون مميز للزر
  backButton.style.color = "#121212"; // لون النص
  backButton.addEventListener("click", () => {
    location.reload(); // إعادة تحميل الصفحة
  });
  resultContainer.appendChild(backButton);
}

function handleSubmit() {
  if (navigator.onLine) {
    sendEmail(stripHTML(resultContainer.innerHTML));
    resultContainer.innerHTML += `<p style="color: green; font-weight: bold;">تم إرسال الإجابات بنجاح.</p>`;
    document.getElementById(`test${currentTest}-status`).textContent =
      "الحالة: تم الامتحان";
    document
      .getElementById(`test${currentTest}-status`)
      .classList.remove("status-not-done");
    document
      .getElementById(`test${currentTest}-status`)
      .classList.add("status-done");
    document.getElementById(`test${currentTest}-status`).style.color = "green";
    localStorage.setItem(`test${currentTest}-status`, "تم الامتحان");
  } else {
    alert("أنت لست متصل بالإنترنت، لم يتم تسليم الاختبار.");
  }

  document.getElementById("back-to-main-menu-button").style.display = "none"; // إخفاء زر الرجوع إلى القائمة الرئيسية

  let countdown = 5;
  const countdownElement = document.createElement("p");
  countdownElement.style.color = "red";
  countdownElement.style.fontWeight = "bold";
  resultContainer.appendChild(countdownElement);

  const countdownInterval = setInterval(() => {
    countdownElement.textContent = `سيتم ارجاعك الى القائمة الرئيسية خلال ${countdown} ثواني`;
    countdown--;
    if (countdown < 0) {
      clearInterval(countdownInterval);
      location.reload(); // إعادة تحميل الصفحة
    }
  }, 1000); // عداد 5 ثواني
}

function resetTest() {
  currentTest = 0;
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  questionsContainer.innerHTML = "";
  nextButton.style.display = "none";
  resultContainer.innerHTML = "";
  document.body.classList.remove("no-background"); // إعادة الخلفية
}

function stripHTML(html) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function sendEmail(resultText) {
  const username = localStorage.getItem("username"); // استرجاع اسم المستخدم من الذاكرة الداخلية
  const templateParams = {
    to_email: "yta861356@gmail.com",
    from_name: username,
    message: `اسم الطالب: ${username}\n${resultText}`,
  };

  fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: "service_hufi8li",
      template_id: "template_1iaohnh",
      user_id: "hX0tBR1huam3gEj78",
      template_params: templateParams,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("SUCCESS!", response.status, response.text());
      } else {
        console.log("FAILED...", response.status, response.text());
      }
    })
    .catch((error) => {
      console.log("FAILED...", error);
    });
}

function updateTestStatus() {
  for (let i = 1; i <= 7; i++) { // تحديث الحالة لجميع الاختبارات
    const status = localStorage.getItem(`test${i}-status`);
    if (status) {
      document.getElementById(
        `test${i}-status`
      ).textContent = `الحالة: ${status}`;
      if (status === "تم الامتحان") {
        document.getElementById(`test${i}-status`).style.color = "green";
      } else {
        document.getElementById(`test${i}-status`).style.color = "red";
      }
    } else {
      document.getElementById(`test${i}-status`).textContent =
        "الحالة: لم يتم الامتحان";
      document.getElementById(`test${i}-status`).style.color = "red";
    }
  }
}

window.addEventListener("online", () => {
  for (let i = 1; i <= 7; i++) {
    const storedAnswers = localStorage.getItem(`userAnswersTest${i}`);
    if (storedAnswers) {
      sendEmail(stripHTML(storedAnswers));
      localStorage.removeItem(`userAnswersTest${i}`);
      document.getElementById(`test${i}-status`).textContent =
        "الحالة: تم الامتحان";
      document.getElementById(`test${i}-status`).style.color = "green";
    }
  }
});

// تحديث حالة الامتحانات عند تحميل الصفحة
updateTestStatus();

// التحقق من وجود اسم المستخدم في الذاكرة الداخلية وعرض قائمة الاختبارات مباشرة إذا كان موجودًا
window.addEventListener("load", () => {
  const storedUsername = localStorage.getItem("username");
  if (storedUsername) {
    document.getElementById("username").value = storedUsername;
    welcomeContainer.style.display = "none";
    formContainer.style.display = "none"; // إخفاء الفورم
    testSelectionContainer.style.display = "block";
    testSelectionContainer.classList.add("visible");
  }
});

function logout() {
  localStorage.clear(); // حذف جميع البيانات المخزنة في الذاكرة الداخلية
  location.reload(); // إعادة تحميل الصفحة
}
