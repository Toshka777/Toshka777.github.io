const questions = [
  {
    question: "ما هي عاصمة فرنسا؟",
    options: ["باريس", "لندن", "روما", "مدريد"],
    correctAnswer: "باريس",
  },
  {
    question: "ما هو أكبر كوكب في المجموعة الشمسية؟",
    options: ["الأرض", "المريخ", "المشتري", "زحل"],
    correctAnswer: "المشتري",
  },
  {
    question: "ما هو الحيوان الأسرع في العالم؟",
    options: ["الفهد", "الأسد", "النمر", "الفيل"],
    correctAnswer: "الفهد",
  },
];

let currentQuestionIndex = 0; // مؤشر السؤال الحالي
let score = 0; // درجة المستخدم
let userAnswers = []; // تخزين إجابات المستخدم

const welcomeContainer = document.querySelector(".welcome-container"); // عنصر يحتوي على شاشة الترحيب
const formContainer = document.querySelector(".form-container"); // عنصر يحتوي على الفورم
const questionsContainer = document.getElementById("questions-container"); // عنصر يحتوي على الأسئلة
const nextButton = document.getElementById("next-button"); // زر الانتقال للسؤال التالي
const resultContainer = document.getElementById("result"); // عنصر لعرض النتيجة النهائية

// إخفاء شاشة الترحيب بعد 3 ثواني وعرض الفورم
setTimeout(() => {
  welcomeContainer.classList.add("hidden");
  setTimeout(() => {
    welcomeContainer.style.display = "none";
    formContainer.style.display = "block";
    formContainer.classList.add("visible");
  }, 1300); // تأخير لإخفاء شاشة الترحيب بشكل كامل
}, 1500);

document.getElementById("user-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const namePattern = /^[a-zA-Z\u0600-\u06FF\s]+$/; // نمط للتحقق من أن الاسم يحتوي على حروف فقط (عربية أو إنجليزية)

  if (!namePattern.test(username)) {
    alert("الرجاء إدخال اسم صحيح بدون أرقام.");
    return;
  }

  formContainer.style.display = "none"; // إخفاء الفورم بدون أنيميشن
  const container = document.querySelector(".container");
  container.style.display = "block";
  container.classList.add("visible");
  showQuestion(currentQuestionIndex);
});

function showQuestion(index) {
  questionsContainer.innerHTML = ""; // تفريغ محتوى عنصر الأسئلة
  const question = questions[index]; // الحصول على السؤال الحالي
  const questionDiv = document.createElement("div"); // إنشاء عنصر جديد للسؤال
  questionDiv.classList.add("question"); // إضافة فئة CSS للسؤال

  const questionTitle = document.createElement("h2"); // إنشاء عنصر لعنوان السؤال
  questionTitle.textContent = question.question; // تعيين نص السؤال
  questionDiv.appendChild(questionTitle); // إضافة عنوان السؤال إلى عنصر السؤال

  const optionsDiv = document.createElement("div"); // إنشاء عنصر جديد للخيارات
  optionsDiv.classList.add("options"); // إضافة فئة CSS للخيارات

  question.options.forEach((option) => {
    const button = document.createElement("button"); // إنشاء زر لكل خيار
    button.textContent = option; // تعيين نص الخيار
    button.addEventListener("click", () => {
      // إضافة مستمع للنقر على الزر
      userAnswers[index] = option; // تخزين إجابة المستخدم
      document.querySelectorAll(".options button").forEach((btn) => {
        btn.classList.remove("selected"); // إزالة الفئة من جميع الأزرار
      });
      button.classList.add("selected"); // إضافة الفئة للزر المحدد
      nextButton.style.display = "block"; // عرض زر الانتقال للسؤال التالي
      if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = "تسليم الاختبار"; // تغيير نص الزر في السؤال الأخير
      }
    });
    optionsDiv.appendChild(button); // إضافة الزر إلى عنصر الخيارات
  });

  questionDiv.appendChild(optionsDiv); // إضافة عنصر الخيارات إلى عنصر السؤال
  questionsContainer.appendChild(questionDiv); // إضافة عنصر السؤال إلى عنصر الأسئلة
}

nextButton.addEventListener("click", () => {
  // إضافة مستمع للنقر على زر الانتقال للسؤال التالي
  currentQuestionIndex++; // زيادة مؤشر السؤال الحالي
  if (currentQuestionIndex < questions.length) {
    showQuestion(currentQuestionIndex); // عرض السؤال التالي
    nextButton.style.display = "none"; // إخفاء زر الانتقال للسؤال التالي
  } else {
    showResult(); // عرض النتيجة النهائية
  }
});

function showResult() {
  questionsContainer.style.display = "none"; // إخفاء عنصر الأسئلة
  nextButton.style.display = "none"; // إخفاء زر الانتقال للسؤال التالي
  resultContainer.style.display = "block"; // عرض عنصر النتيجة النهائية

  let resultHTML = `<h2>نتائج الاختبار</h2>`;
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
  resultHTML += `<button id="send-button" class="send-button">إرسال الإجابات</button>`; // إضافة زر إرسال الإجابات
  resultContainer.innerHTML = resultHTML;

  document.getElementById("send-button").addEventListener("click", handleSend);
}

function handleSend() {
  if (navigator.onLine) {
    sendEmail(userAnswers);
  } else {
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    alert("لا يوجد اتصال بالإنترنت. سيتم إرسال الإجابات عند توفر الإنترنت.");
  }
}

function sendEmail(answers) {
  const username = document.getElementById("username").value;
  const templateParams = {
    to_email: "yta861356@gmail.com",
    from_name: username,
    message: `اسم الطالب: ${username}\nالنتيجة: ${JSON.stringify(answers)}`,
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

window.addEventListener("online", () => {
  const storedAnswers = localStorage.getItem("userAnswers");
  if (storedAnswers) {
    sendEmail(JSON.parse(storedAnswers));
    localStorage.removeItem("userAnswers");
  }
});
