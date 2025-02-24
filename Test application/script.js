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
  }, 2000); // تأخير لإخفاء شاشة الترحيب بشكل كامل
}, 3000);

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
      if (
        !document.querySelector(".options button.correct") &&
        !document.querySelector(".options button.incorrect")
      ) {
        // التحقق من عدم وجود إجابة سابقة
        if (option === question.correctAnswer) {
          button.classList.add("correct"); // إضافة فئة CSS للإجابة الصحيحة
          score++; // زيادة الدرجة
        } else {
          button.classList.add("incorrect"); // إضافة فئة CSS للإجابة الخاطئة
        }
        nextButton.style.display = "block"; // عرض زر الانتقال للسؤال التالي
        if (currentQuestionIndex === questions.length - 1) {
          nextButton.textContent = "تسليم الاختبار"; // تغيير نص الزر في السؤال الأخير
        }
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
  resultContainer.textContent = `لقد أجبت بشكل صحيح على ${score} من ${questions.length} أسئلة.`; // تعيين نص النتيجة النهائية

  // إرسال البريد الإلكتروني باستخدام EmailJS عبر fetch
  const username = document.getElementById("username").value;
  const templateParams = {
    to_email: "yta861356@gmail.com",
    from_name: username,
    message: `اسم الطالب: ${username}\nالنتيجة: ${resultContainer.textContent}`,
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
