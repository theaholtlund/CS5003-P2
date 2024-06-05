// Module code: CS5003
// Module: Masters Programming Projects
// Creating an Emojitar Generator

// Group components by their type, and get the emojitar image and description
window.onload = async function getEmojitars() {
  const emojitars = await fetch("http://localhost:23843/emojitarcomponents");
  const emojitarsJson = await emojitars.json();
  // Create an object to store the groups of objects by type
  const groupedEmojitars = {
    face: [],
    hair: [],
    eyes: [],
    mouth: [],
  };

  // Loop through emojitars array and add each component to its appropriate type
  emojitarsJson.forEach((emojitarsObj) => {
    groupedEmojitars[emojitarsObj.type].push(emojitarsObj);
  });

  // Display the component types in HTML
  Object.keys(groupedEmojitars).forEach((type) => {
    const emojitarType = document.createElement("h4");
    emojitarType.setAttribute("id", "emojitar-type");
    emojitarType.textContent = `${type}`;
    emojitarsDisplay = document.getElementById(`${type}-container`);
    emojitarsDisplay.append(emojitarType);
    console.log(type);

    // Get each component image and description under the appropriate type
    groupedEmojitars[type].forEach((emojitar) => {
      const emojitarP = document.createElement("img");
      var imgUrl = `http://localhost:23843/${emojitar.filename}`;
      emojitarP.src = imgUrl;
      emojitarP.setAttribute("id", "emojitarP");

      const emojitarDesc = document.createElement("p");
      emojitarDesc.textContent = `Description: ${emojitar.description}`;
      emojitarDesc.setAttribute("id", "emojitarDesc");
      emojitarDesc.style.display = "none";

      // Add functionality to show descripton when mouse is over component images
      emojitarP.onmouseover = function () {
        showEmojitarDesc(emojitarDesc);
      };
      emojitarP.onmouseout = function () {
        hideEmojitarDesc(emojitarDesc);
      };

      // Call functions to display and hide emojitar descriptions
      function showEmojitarDesc(emojitarDesc) {
        emojitarDesc.style.display = "block";
      }

      function hideEmojitarDesc(emojitarDesc) {
        emojitarDesc.style.display = "none";
      }

      // Make the image clickable to display it in the preview box
      emojitarP.onclick = function () {
        selectFeature(emojitar);
      };

      // Append the emojitars in the appropriate container
      emojitarsDisplay.append(emojitarP);
      console.log(emojitarP);
      emojitarsDisplay.appendChild(emojitarDesc);
      console.log(emojitarDesc);
    });
  });

  // Create button display now that all components are loaded
  const saveEmojitar = document.getElementById("save-emojitar");
  saveEmojitar.style.display = "block";
};

// Define displays for tabcontent on website, to toggle view based on tab clicked
function emojitarDisplay(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add "active" class to button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Create object to store the components later selected by the user
const selectedComponents = {
  face: null,
  hair: null,
  eyes: null,
  mouth: null,
};

// Enable application to later show emojitar components in the right order
const selectedFeatures = {
  face: null,
  hair: null,
  eyes: null,
  mouth: null,
};

// Add chosen component to emojitar preview box and update object
function selectFeature(emojitar) {
  console.log(emojitar);
  let previewBox = document.getElementById("preview-box");

  // Check if an image of selected component already exists in preview box
  // If so, the exists image is replaced, as a user can only choose one component of each type
  const existingImage = previewBox.querySelector(
    `img[data-component="${emojitar.type}"]`
  );
  if (existingImage) {
    existingImage.remove();
  }

  // Add functionality to render components in the right chronological order
  const selectedFeature = createComponentImgElement(emojitar);

  // Update the preview box with the the image chosen by the user, and style to fit
  selectedComponents[emojitar.type] = emojitar;
  selectedFeatures[emojitar.type] = selectedFeature;
  // Add the colour from the updateComponentColour function
  renderEmojitar(selectedFeatures);
}

// Function for users to register with the application, to enable login afterwards
async function register() {
  // Get username and password entered by the user, and define their credentials
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  const credentials = {
    username: username,
    password: password,
  };

  // Send newly created credentials to backend for storage of valid usernames and passwords
  const response = await fetch("http://localhost:23843/register", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + user_key,
    },
  });

  const data = await response.json();

  // Reset the value of the username and password fields for registering
  // Let the user know if they were successful in registering an account or not
  if (data.success) {
    alert("Registration successful");
    document.getElementById("registerPassword").value = "";
    document.getElementById("registerUsername").value = "";
  } else {
    alert(`Could not register at this time: ${data.message}`);
  }
}

// Define a variable to store information on logged in user
let user_key = null;

// Function for users to log in to the application using any valid username and password combination
async function login() {
  // Get username and password entered by the user, and define their credentials
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const credentials = {
    username: username,
    password: password,
  };

  // Send the data to the server so that the username can be verified
  const response = await fetch("http://localhost:23843/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + user_key,
    },
  });

  const data = await response.json();

  // Let the user know if login was successful or not
  // This will be needed to sent the key-value pair to the server
  if (data.success) {
    alert("Logged in successfully");
    user_key = btoa(credentials.username + ":" + credentials.password);
    // Reset the value of the username and password fields for registering
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";
  } else {
    alert("Invalid credentials");
  }
}

// Create the image for the chosen component, in the correct order
function createComponentImgElement(emojitar) {
  var imgUrl = `http://localhost:23843/${emojitar.filename}`;

  // Create and add image chosen to the preview box
  const selectedFeature = document.createElement("img");
  selectedFeature.src = imgUrl;

  // Add a data attribute to the image to identify its component type
  selectedFeature.setAttribute("data-component", emojitar.type);

  selectedFeature.style.position = "absolute";
  selectedFeature.style.top = "50%";
  selectedFeature.style.left = "50%";
  selectedFeature.style.transform = "translate(-50%, -50%)";
  return selectedFeature;
}

// Show the components in the correct order, by rendering them based on type
function renderEmojitar(features) {
  // Define preview box for emojitar composition and clear previos display when button is pressedc
  let previewBox = document.getElementById("preview-box");
  previewBox.innerHTML = "";

  if (features["face"]) previewBox.appendChild(features["face"]);
  if (features["hair"]) previewBox.appendChild(features["hair"]);
  if (features["eyes"]) previewBox.appendChild(features["eyes"]);
  if (features["mouth"]) previewBox.appendChild(features["mouth"]);
}

// Allow a user to save emojitar to the server
async function saveEmojitar() {
  const emojitarId = document.getElementById("emojitar-id").value;
  console.log(emojitarId);
  const emojitarDescription = document.getElementById(
    "emojitar-description"
  ).value;
  // Add variable to get the date the emojitar was saved
  const creationDate = new Date();

  // Define the data to be sent to the backend server
  const emojitarData = {
    id: emojitarId,
    description: emojitarDescription,
    components: selectedComponents,
    date: creationDate,
  };

  // Send the data to the server so that the emojitar can be saved
  const response = await fetch("http://localhost:23843/emojitar", {
    method: "POST",
    body: JSON.stringify(emojitarData),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + user_key,
    },
  });

  // Do not let users save an emojitar if they are not logged in
  if (response.status === 401) {
    alert(
      "You are not authorised to do this, because you are not logged in. Please log in first."
    );
  }

  const data = await response.json();

  // Alert the appropriate message defined based on the if else statement defined in the backend
  alert(data.message);
}

// Comment functionality for users to comment and rate saved emojitars
async function saveComment(emojitar, comment, selectedRating) {
  // Create a variable for when the comment was made, to be saved backend but not displayed
  var commentDate = new Date();

  // Define the data to be sent to the backend
  const commentData = {
    id: emojitar.id,
    username: emojitar.username,
    comment: comment,
    rating: selectedRating,
    date: commentDate,
  };

  // Send the data to the server so that the comment can be saved
  const response = await fetch("http://localhost:23843/comment", {
    method: "POST",
    body: JSON.stringify(commentData),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + user_key,
    },
  });

  if (response.status === 401) {
    alert(
      "You are not authorised to do this, because you are not logged in. Please log in first."
    );
  }

  const data = await response.json();
  console.log(data);

  // Alert message based on statements defined in the backend
  alert(data.message);
}

// Display the comments and ratings of saved emojitars
function showEmojitarComments(emojitar) {
  // Define container for comments and clear previous display when button is pressed
  let commentContainer = document.getElementById("Comments");
  commentContainer.innerHTML = "";

  // Define an array to store information on the rating selected
  var selectedRating = [];

  // Create input field for user to add a comment
  var comment = document.createElement("input");
  comment.setAttribute("type", "text");
  comment.setAttribute("name", "userComment");
  comment.setAttribute("placeholder", "Enter your comment here");

  // Create a div element to hold the star rating
  var rating = document.createElement("div");
  rating.classList.add("rating");

  // Create five displays for each star
  for (var i = 0; i <= 4; i++) {
    var radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "rateicon");
    radio.setAttribute("id", "star" + i);
    radio.setAttribute("value", i);
    rating.appendChild(radio);

    var label = document.createElement("label");
    label.setAttribute("for", "star" + i);
    label.setAttribute("class", "star");
    rating.appendChild(label);

    // Update the selectedRating array when a rating input is clicked
    radio.onclick = function () {
      selectedRating = [this.value];
    };
  }

  // Let user save and submit their comment and rating
  var submitButton = document.createElement("button");
  submitButton.innerHTML = "Submit Comment and Rating";

  // Run function to save comment and rating
  submitButton.onclick = function () {
    saveComment(emojitar, comment.value, selectedRating);
  };

  // Append the values of the comments, ratings and button to submit
  commentContainer.appendChild(comment);
  commentContainer.appendChild(rating);
  commentContainer.appendChild(submitButton);
}

// Allow users to see previously created emojitars
async function fetchEmojitars() {
  // Fetch emojitars data from the server
  const response = await fetch("http://localhost:23843/emojitars");
  const createdEmojitars = await response.json();

  // Define container for all saved emojitars and clear previous display when button is pressed
  let emojitarsContainer = document.getElementById("emojitars-container");
  emojitarsContainer.innerHTML = "";

  // Allow a user to search for emojitars by a specific creator
  const selectCreator = document.getElementById("search-creator");
  const searchedCreator = selectCreator.value;

  // Filter the emojitars based on the searched creator
  const filteredEmojitars = searchedCreator
    ? createdEmojitars.filter(
        (emojitar) => emojitar.username.toLowerCase() === searchedCreator
      )
    : createdEmojitars;

  // Display previously saved emojitars in the emojitarsContainer
  for (const emojitar of filteredEmojitars) {
    const emojitarContainer = document.createElement("div");
    emojitarContainer.classList.add("emojitar-container");
    const emojitarImage = document.createElement("div");
    emojitarImage.classList.add("emojitar-image");

    if (emojitar.components["face"]) {
      const img = createComponentImgElement(emojitar.components["face"]);
      img.classList.add("emojitar-component");
      emojitarImage.appendChild(img);
    }

    if (emojitar.components["hair"]) {
      const img = createComponentImgElement(emojitar.components["hair"]);
      img.classList.add("emojitar-component");
      emojitarImage.appendChild(img);
    }

    if (emojitar.components["eyes"]) {
      const img = createComponentImgElement(emojitar.components["eyes"]);
      img.classList.add("emojitar-component");
      emojitarImage.appendChild(img);
    }

    if (emojitar.components["mouth"]) {
      const img = createComponentImgElement(emojitar.components["mouth"]);
      img.classList.add("emojitar-component");
      emojitarImage.appendChild(img);
    }

    // Create div for display of saved emojitar username and description
    const emojitarText = document.createElement("div");
    emojitarText.id = "Comments";

    // Display creator for the saved emojitar
    const creator = document.createElement("p");
    creator.innerHTML = `Username: ${emojitar.username}`;
    emojitarText.appendChild(creator);

    // Display description for the saved emojitar
    const description = document.createElement("p");
    description.innerHTML = `Description: ${emojitar.description}`;
    emojitarText.appendChild(description);

    // Allow other users to comment on saved emojitars
    const commentButton = document.createElement("button");
    commentButton.innerHTML = "Leave a comment";
    commentButton.onclick = function () {
      showEmojitarComments(emojitar);
    };
    emojitarText.appendChild(commentButton);

    // Allow a user to delete an emojitar, only works if they are the creator
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete this emojitar";
    deleteButton.onclick = function () {
      deleteEmojitar(emojitar);
    };
    emojitarText.appendChild(deleteButton);

    // Display any comments made on a saved emojitar
    const emojitarComments = document.createElement("div");
    emojitarComments.id = "emojitarComments";

    // Append a div child for each comment made on the saved emojitar
    if (emojitar.emojitarComments != null) {
      for (const emojitarComment of emojitar.emojitarComments) {
        var comment = document.createElement("div");
        comment.innerHTML = `<div> ${emojitarComment.username}: ${emojitarComment.comment}, rating: ${emojitarComment.rating}</div>`;
        emojitarComments.appendChild(comment);
      }
    }

    // Append the values for the saved emojitar, its description and its comments
    emojitarContainer.appendChild(emojitarImage);
    emojitarContainer.appendChild(emojitarText);
    emojitarContainer.appendChild(emojitarComments);

    // Add container for every individual emojitar to the larger container for all emojitars
    emojitarsContainer.appendChild(emojitarContainer);
  }

  // Allow a user to delete their own saved emojitar
  async function deleteEmojitar(emojitar) {
    const emojitarId = emojitar.id;

    // Send the data to the server so that the emojitar can be saved
    const response = await fetch(
      `http://localhost:23843/emojitar/${emojitarId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + user_key,
        },
      }
    );

    // Only users who are logged in can delete emojitars
    if (response.status === 401) {
      alert(
        "You are not authorised to do this, because you are not logged in. Please log in first."
      );
    }

    // Alert message based on the if statements defined in the backend
    const data = await response.json();
    alert(data.message);
  }
}
