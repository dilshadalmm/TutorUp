
const firebaseConfig = {
  apiKey: "AIzaSyCvxuIDHuT9BPGVD9ZfrF2MrN7FECIxN70",
  authDomain: "dilshad-almm.firebaseapp.com",
  projectId: "dilshad-almm",
  storageBucket: "dilshad-almm.firebasestorage.app",
  messagingSenderId: "559661476201",
  appId: "1:559661476201:web:bbc65b8a7b74121d91f5f8"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function addNewCourseForm(course = {}, id = null) {
  const container = document.getElementById('courseEditorList');
  const card = document.createElement('div');
  card.className = 'course-card';
  card.innerHTML = `
    <label>Title: <input type="text" value="${course.title || ''}" /></label>
    <label>Description: <textarea>${course.description || ''}</textarea></label>
    <label>Instructor: <input type="text" value="${course.instructor || ''}" /></label>
    <label>Thumbnail URL: <input type="text" value="${course.thumbnail || ''}" /></label>
    <label>Price: <input type="number" value="${course.price || ''}" /></label>
    <button onclick="saveCourse(this${id ? `, '${id}'` : ''})">${id ? "Update" : "Save"}</button>
  `;
  container.appendChild(card);
}

function saveCourse(btn, docId = null) {
  const inputs = btn.parentElement.querySelectorAll('input, textarea');
  const courseData = {
    title: inputs[0].value,
    description: inputs[1].value,
    instructor: inputs[2].value,
    thumbnail: inputs[3].value,
    price: parseFloat(inputs[4].value),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  if (docId) {
    db.collection("courses").doc(docId).update(courseData).then(() => {
      alert("Course updated successfully!");
    });
  } else {
    courseData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    db.collection("courses").add(courseData).then(() => {
      alert("New course added!");
    });
  }
}

function loadCourses() {
  db.collection("courses").get().then(snapshot => {
    snapshot.forEach(doc => {
      addNewCourseForm(doc.data(), doc.id);
    });
  });
}

window.onload = loadCourses;
