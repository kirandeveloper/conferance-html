// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("gotoTop").style.display = "block";
    } else {
        document.getElementById("gotoTop").style.display = "none";
    }
   
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
 
     $('html, body').animate({scrollTop:0}, 'slow');
}

// Thumbnail active state handling
const thumbnails = document.querySelectorAll('.thumbnail-nav img');
thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', function () {
     thumbnails.forEach(t => t.classList.remove('active-thumb'));
    this.classList.add('active-thumb');
    });
});

document.getElementById("hallSelect").addEventListener("change", function () {

    // Hide all sections
    const sections = document.querySelectorAll(".hall-section");
    sections.forEach(section => section.classList.add("d-none"));

    // Show selected section
    const selectedHall = this.value;
    if (selectedHall) {
        document.getElementById(selectedHall).classList.remove("d-none");
    }
});


/* shedule */

fetch("../data/schedule.json")
  .then(response => response.json())
  .then(data => {

    /* =========================
       TAB 1 → HOME (NO SELECT)
       ========================= */

    const day1 = document.getElementById("scheduleDay1");
    const container1 = document.getElementById("scheduleContainer1");

    if (day1 && container1) {

      day1.textContent = data.day;
      container1.innerHTML = "";

      data.halls.forEach(hall => {

        let hallHTML = `
          <div class="col-md-12 schedule-item-main mb-3 mt-4">
              <h3>${hall.hallName}</h3>
          </div>
        `;

        hall.sessions.forEach(session => {

          let bgClass = session.bgClass ? session.bgClass : "";

          hallHTML += `
            <div class="schedule-item ${bgClass} row align-items-start mb-4">
              <div class="col-md-2 schedule-time">
                ${session.time.replace(" to ", " to<br/>")}
              </div>
              <div class="col-md-10 schedule-content">
                <h5>${session.title}</h5>
          `;

          if (session.details) {
            session.details.forEach(detail => {
              hallHTML += `<p>${detail}</p>`;
            });
          }

          if (session.speaker) {
            hallHTML += `<p><strong>${session.speaker}</strong></p>`;
          }

          if (session.presentedBy) {
            hallHTML += `<p>(Presented by) <strong>${session.presentedBy}</strong></p>`;
          }

          hallHTML += `
              </div>
            </div>
          `;
        });

        container1.innerHTML += hallHTML;
      });
    }


    /* =========================
       TAB 2 → WITH SELECT
       ========================= */

    const hallSelect = document.getElementById("hallSelect");
    const dayEl = document.getElementById("scheduleDay");
    const hallTitle = document.getElementById("scheduleHall");
    const container = document.getElementById("scheduleContainer");

    if (hallSelect && dayEl && hallTitle && container) {

      dayEl.textContent = data.day;

      // Populate dropdown
      data.halls.forEach((hall, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = hall.hallName;
        hallSelect.appendChild(option);
      });

      // Load first hall by default
      loadHall(0);

      hallSelect.addEventListener("change", function () {
        loadHall(this.value);
      });

      function loadHall(index) {

        const hallData = data.halls[index];
        hallTitle.textContent = hallData.hallName;
        container.innerHTML = "";

        hallData.sessions.forEach(session => {

          let bgClass = session.bgClass ? session.bgClass : "";

          let html = `
            <div class="schedule-item ${bgClass} row align-items-start mb-4">
              <div class="col-md-2 schedule-time">
                ${session.time.replace(" to ", " to<br/>")}
              </div>
              <div class="col-md-10 schedule-content">
                <h5>${session.title}</h5>
          `;

          if (session.details) {
            session.details.forEach(detail => {
              html += `<p>${detail}</p>`;
            });
          }

          if (session.speaker) {
            html += `<p><strong>${session.speaker}</strong></p>`;
          }

          if (session.presentedBy) {
            html += `<p>(Presented by) <strong>${session.presentedBy}</strong></p>`;
          }

          html += `
              </div>
            </div>
          `;

          container.innerHTML += html;
        });
      }
    }

  })
  .catch(error => console.error("Error loading JSON:", error));