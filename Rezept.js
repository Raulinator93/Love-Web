// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, getDoc, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGCVDmUPQuIeQvblZfv0rBQtpxZdaheAI",
  authDomain: "love-web-a3854.firebaseapp.com",
  projectId: "love-web-a3854",
  storageBucket: "love-web-a3854.firebasestorage.app",
  messagingSenderId: "843790519171",
  appId: "1:843790519171:web:e4b43bff1f130dabbf84b6",
  measurementId: "G-QSH9Y51Q8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export async function renderRezepte() {
    const overlay = document.getElementById("rezepteOverlay");

    try {
      // So holst du alle Dokumente aus der Collection "Rezepte":
      const querySnapshot = await getDocs(collection(db, "Rezepte"));

      let html = "";

      querySnapshot.forEach(doc => {
        const r = doc.data();
        html += `
          <a href="Rezept.html?id=${doc.id}">
            <div class="rezept">
              <div class="rezept-title">${r.title}</div>
              <div class="rezept-desc">${r.desc}</div>
              <div class="zutaten"><strong>Zutaten:</strong> ${r.zutaten?.join(", ")}</div>
            </div>
          </a>
        `;
      });

      overlay.innerHTML = html || "<p>Keine Rezepte gefunden.</p>";
    } catch (error) {
      overlay.innerHTML = "<p>Fehler beim Laden der Rezepte.</p>";
      console.error("Fehler beim Laden der Rezepte:", error);
    }
  }

export async function renderRezept(rezeptId) {
  const container = document.getElementById('rezept-detail');

  if (!rezeptId) {
    container.textContent = 'Keine Rezept-ID angegeben.';
    return;
  }

  try {
    const docRef = doc(db, "Rezepte", rezeptId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      container.textContent = 'Rezept nicht gefunden.';
      return;
    }

    const r = docSnap.data();

    container.innerHTML = `
      <div class="rezept">
        <div class="rezept-title">${r.title}</div>
        <div class="rezept-desc">${r.desc}</div>
        <div class="zutaten"><strong>Zutaten:</strong> ${r.zutaten?.join(', ')}</div>
        <div class="schritte">
          <strong>Schritte:</strong>
          <ol>
            ${r.schritte?.map(s => `<li>${s}</li>`).join('')}
          </ol>
        </div>
      </div>
    `;
  } catch (error) {
    container.textContent = 'Fehler beim Laden des Rezepts.';
    console.error('Fehler beim Laden des Rezepts:', error);
  }
}


export async function addRezept(){
  const title = document.getElementById("newTitle").value.trim();
  const desc = document.getElementById("newDesc").value.trim();
  const zutatenText = document.getElementById("newZutaten").value.trim();
  const schritteText = document.getElementById("newSchritte").value.trim();

  if (!title || !desc || !zutatenText) {
    alert("Bitte alle Felder ausfüllen!");
    return;
  }

  const zutaten = zutatenText.split(";").map(z => z.trim());
  const schritte = schritteText.split(";").map(z => z.trim());
  console.log("all data loaded");
   try {
        await addDoc(collection(db, "Rezepte"),{
          title,
          desc,
          zutaten,
          schritte
        });

        document.getElementById("result").textContent = "✅ Rezept erfolgreich gespeichert!";
        setTimeout(() => {
          document.getElementById("newTitle").value = "";
          document.getElementById("newDesc").value = "";
          document.getElementById("newZutaten").value = "";
          document.getElementById("newSchritte").value = "";
          resultBox.textContent = "";
          document.getElementById("popupOverlay").style.display = "none";
        }, 1500);
        renderRezepte();
      } catch (error) {
        document.getElementById("result").textContent = "❌ Fehler beim Speichern: " + error.message;
      }
}

export async function deleteRezept(id){
  try {
    const docRef = doc(db, "Rezepte", id);
    await deleteDoc(docRef);
    console.log("✅ Rezept erfolgreich gelöscht:", id);
  } catch (error) {
    console.error("❌ Fehler beim Löschen des Rezepts:", error);
  }
}