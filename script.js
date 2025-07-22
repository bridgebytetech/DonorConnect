// Replace this with your deployed Google Apps Script Web App URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbxJQ7jPDDsRfyOtOlkPVoV2i0p5dATQxrrpt8bf2pdoh7AoK0r7aZstQBQXxlbjDG-1SA/exec';

const donorForm = document.getElementById('donorForm');
const typeSelect = document.getElementById('type');
const subtypeSelect = document.getElementById('subtype');

const subtypes = {
  Plasma: ["A", "B", "AB", "O"],
  Platelet: ["Random Donor", "Single Donor", "Apheresis"]
};

typeSelect.addEventListener("change", () => {
  const selected = typeSelect.value;
  subtypeSelect.innerHTML = '<option value="">Select Subtype</option>';
  if (subtypes[selected]) {
    subtypes[selected].forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      subtypeSelect.appendChild(option);
    });
  }
});

donorForm.addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData(donorForm);
  const jsonData = Object.fromEntries(formData.entries());

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(jsonData)
  })
  .then(res => res.text())
  .then(() => {
    alert("✅ Donor registered successfully!");
    donorForm.reset();
    subtypeSelect.innerHTML = '<option value="">Select Subtype</option>';
  })
  .catch(err => alert("Error: " + err));
});

function searchDonors() {
  const type = document.getElementById('searchType').value;
  if (!type) return alert("Please select a donor type");

  fetch(`${scriptURL}?type=${type}`)
    .then(res => res.json())
    .then(data => {
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";

      if (!data.length) {
        resultsDiv.innerHTML = "<p class='text-center text-red-599'>No donors found.</p>";
        return;
      }

      data.forEach(donor => {
        const card = document.createElement("div");
        card.className = "border-l-4 border-red-600 bg-red-50 p-4 rounded shadow";

        card.innerHTML = `
          <div class="text-lg font-semibold text-red-800">${donor.name} (${donor.subtype})</div>
          <div>📍 <span class="font-medium">${donor.location}</span></div>
          <div>📞 +880<span>${donor.contact}</span></div>
          <div>✅ <span class="text-green-700 font-medium">Available: ${donor.availability}</span></div>
          <div>💉 Last Donated: ${donor.lastDonated || "N/A"}</div>
          <div>🗓️ Registered: ${donor.registeredAt}</div>
        `;

        resultsDiv.appendChild(card);
      });
    });
}
