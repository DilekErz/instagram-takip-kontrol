const followersInput = document.getElementById("followersFile");
const followingInput = document.getElementById("followingFile");
const compareBtn = document.getElementById("compareBtn");
const results = document.getElementById("results");

function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (error) {
        reject("JSON dosyası okunamadı.");
      }
    };

    reader.readAsText(file);
  });
}

function extractUsernames(data) {
  return data.map(item => {
    return item.string_list_data[0].value;
  });
}

compareBtn.addEventListener("click", async () => {
  const followersFile = followersInput.files[0];
  const followingFile = followingInput.files[0];

  if (!followersFile || !followingFile) {
    results.innerHTML = "Lütfen iki dosyayı da yükle.";
    return;
  }

  const followersData = await readJsonFile(followersFile);
  const followingData = await readJsonFile(followingFile);

  const followers = extractUsernames(followersData);
  const following = extractUsernames(followingData.relationships_following);

  const notFollowingBack = following.filter(user => !followers.includes(user));

  results.innerHTML = `
    <p><strong>Seni takip etmeyen kişi sayısı:</strong> ${notFollowingBack.length}</p>
    <ul>
      ${notFollowingBack.map(user => `<li>${user}</li>`).join("")}
    </ul>
  `;
});