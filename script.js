const followersInput = document.getElementById("followersFile");
const followingInput = document.getElementById("followingFile");
const compareBtn = document.getElementById("compareBtn");

const countText = document.getElementById("countText");
const resultList = document.getElementById("resultList");

function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        resolve(JSON.parse(event.target.result));
      } catch {
        reject("JSON dosyası okunamadı.");
      }
    };

    reader.readAsText(file);
  });
}

function getUsername(item) {
  const info = item.string_list_data?.[0];

  if (!info) return null;

  let username = info.value || info.href || "";

  username = username
    .replace("https://www.instagram.com/", "")
    .replace("http://www.instagram.com/", "")
    .replace("www.instagram.com/", "")
    .split("?")[0]
    .replaceAll("/", "")
    .trim()
    .toLowerCase();

 username = username.replace(/^_u/, "");

  return username || null;
}

function extractFollowers(data) {
  if (Array.isArray(data)) {
    return data.map(getUsername).filter(Boolean);
  }

  if (data.relationships_followers) {
    return data.relationships_followers.map(getUsername).filter(Boolean);
  }

  return [];
}

function extractFollowing(data) {
  if (data.relationships_following) {
    return data.relationships_following.map(getUsername).filter(Boolean);
  }

  if (Array.isArray(data)) {
    return data.map(getUsername).filter(Boolean);
  }

  return [];
}

compareBtn.addEventListener("click", async () => {
  const followersFile = followersInput.files[0];
  const followingFile = followingInput.files[0];

  if (!followersFile || !followingFile) {
    countText.textContent = "Lütfen iki dosyayı da yükle.";
    resultList.innerHTML = "";
    return;
  }

  try {
    const followersData = await readJsonFile(followersFile);
    const followingData = await readJsonFile(followingFile);

    const followers = extractFollowers(followersData);
    const following = extractFollowing(followingData);

    const notFollowingBack = following.filter(
      user => !followers.includes(user)
    );

    countText.innerHTML = `
      <strong>Takipçi dosyasındaki kişi sayısı:</strong> ${followers.length}<br>
      <strong>Takip edilen dosyasındaki kişi sayısı:</strong> ${following.length}<br>
      <strong>Seni geri takip etmeyen kişi sayısı:</strong> ${notFollowingBack.length}
    `;

    if (notFollowingBack.length === 0) {
      resultList.innerHTML = "<li>Herkes seni geri takip ediyor.</li>";
      return;
    }

    resultList.innerHTML = notFollowingBack
      .map(user => `<li><a href="https://instagram.com/${user}" target="_blank">@${user}</a></li>`)
      .join("");

  } catch (error) {
    countText.textContent = "Dosyalar okunurken hata oluştu.";
    resultList.innerHTML = "";
    console.error(error);
  }
});