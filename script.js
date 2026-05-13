const followersInput = document.getElementById("followersFile");
const followingInput = document.getElementById("followingFile");
const compareBtn = document.getElementById("compareBtn");

const countText = document.getElementById("countText");
const resultList = document.getElementById("resultList");

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
    const info = item.string_list_data[0];

    if (info.value) {
      return info.value.toLowerCase();
    }

    if (info.href) {
      return info.href
        .replace("https://www.instagram.com/", "")
        .replace("/", "")
        .toLowerCase();
    }
  });
}

compareBtn.addEventListener("click", async () => {
  const followersFile = followersInput.files[0];
  const followingFile = followingInput.files[0];

  if (!followersFile || !followingFile) {
  countText.textContent = "Lütfen iki dosyayı da yükle.";
  resultList.innerHTML = "";
  return;
}

  const followersData = await readJsonFile(followersFile);
  const followingData = await readJsonFile(followingFile);

  const followers = extractUsernames(followersData);
  const following = extractUsernames(followingData.relationships_following);

 const notFollowingBack = following.filter(user => user && !followers.includes(user));

countText.innerHTML = `<strong>Seni takip etmeyen kişi sayısı:</strong> ${notFollowingBack.length}`;

resultList.innerHTML = notFollowingBack
  .map(user => `<li>${user}</li>`)
  .join("");
});