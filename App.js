import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import emailjs from 'emailjs-com';
import questions from './questions.json'; // تحميل الأسئلة من ملف JSON محلي

const App = () => {
  const [username, setUsername] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        sendStoredAnswers();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkStoredAnswers = async () => {
      const storedAnswers = await AsyncStorage.getItem('userAnswers');
      if (storedAnswers) {
        Alert.alert('Stored Answers', 'You have stored answers that will be sent when internet is available.');
      }
    };
    checkStoredAnswers();
  }, []);

  const storeAnswer = async (answers) => {
    try {
      await AsyncStorage.setItem('userAnswers', JSON.stringify(answers));
    } catch (error) {
      console.error('Failed to store answers', error);
    }
  };

  const sendStoredAnswers = async () => {
    try {
      const storedAnswers = await AsyncStorage.getItem('userAnswers');
      if (storedAnswers) {
        sendEmail(JSON.parse(storedAnswers));
        await AsyncStorage.removeItem('userAnswers');
      }
    } catch (error) {
      console.error('Failed to send stored answers', error);
    }
  };

  const sendEmail = (answers) => {
    const templateParams = {
      to_email: 'yta861356@gmail.com',
      from_name: username,
      message: `اسم الطالب: ${username}\nالنتيجة: ${answers}`,
    };

    emailjs.send('service_hufi8li', 'template_1iaohnh', templateParams, 'hX0tBR1huam3gEj78')
      .then(response => {
        console.log('SUCCESS!', response.status, response.text);
      })
      .catch(error => {
        console.error('FAILED...', error);
      });
  };

  const handleAnswer = (index, option) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = option;
    setUserAnswers(newAnswers);
    storeAnswer(newAnswers);
  };

  const handleSubmit = () => {
    if (isConnected) {
      sendEmail(userAnswers);
    } else {
      Alert.alert('No Internet', 'Your answers will be sent when internet is available.');
    }
  };

  const showResult = () => {
    let resultHTML = `نتائج الاختبار\n`;
    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = question.correctAnswer;
      const isCorrect = userAnswer === correctAnswer;
      if (isCorrect) setScore(score + 1);
      resultHTML += `
        السؤال: ${question.question}\n
        إجابتك: ${userAnswer} ${isCorrect ? "(صحيحة)" : "(خاطئة)"}\n
        ${!isCorrect ? `الإجابة الصحيحة: ${correctAnswer}\n` : ""}
      `;
    });

    resultHTML += `لقد أجبت بشكل صحيح على ${score} من ${questions.length} أسئلة.`;
    return resultHTML;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {currentQuestionIndex === 0 ? (
        <View style={styles.formContainer}>
          <Text style={styles.title}>Enter Your Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={username}
            onChangeText={setUsername}
          />
          <Button title="Start Quiz" onPress={() => setCurrentQuestionIndex(1)} />
        </View>
      ) : currentQuestionIndex <= questions.length ? (
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>{questions[currentQuestionIndex - 1].question}</Text>
          {questions[currentQuestionIndex - 1].options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.optionButton,
                userAnswers[currentQuestionIndex - 1] === option && styles.selectedOption,
              ]}
              onPress={() => handleAnswer(currentQuestionIndex - 1, option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
          <Button
            title={currentQuestionIndex === questions.length ? "Submit Answers" : "Next Question"}
            onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          />
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{showResult()}</Text>
          <Button title="Send Answers" onPress={handleSubmit} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  formContainer: {
    width: '100%',
    maxWidth: 600,
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    color: '#bb86fc',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#333',
    color: '#e0e0e0',
    borderRadius: 4,
  },
  questionContainer: {
    width: '100%',
    maxWidth: 600,
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    textAlign: 'center',
  },
  questionTitle: {
    fontSize: 18,
    color: '#bb86fc',
    marginBottom: 20,
  },
  optionButton: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  selectedOption: {
    borderColor: '#03dac6',
    borderWidth: 2,
  },
  optionText: {
    color: '#e0e0e0',
    textAlign: 'center',
  },
  resultContainer: {
    width: '100%',
    maxWidth: 600,
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#bb86fc',
    marginBottom: 20,
  },
});

export default App;
