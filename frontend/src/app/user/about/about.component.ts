import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';
import { AuthService } from 'src/app/admin/core/services/auth.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  quillModules: {};
  dynamicDocument = "";
  showEditButton = false;
  editMode = false;
  documents = [
    {
      guid: "1",
      content: `<h2>Information about program and origins</h2>
      <p>
          YouCanBenefit provides easy web access to information about a range of
          financial benefits and subsidies. The web tool provides individuals, families, and
          community workers with easy to access information on available municipal, provincial and
          federal benefits. YouCanBenefit is a made-in-Edmonton project that is a partnership
          between the City of Edmonton, e4c, and volunteers from BetaCityYEG.  The tool will have
          open source content and as such, it can be shared with other organizations and
          municipalities nationwide. YouCanBenefit does not collect or track your information.
      </p>
      <p>
          If you would like to provide feedback on anything please contact
          us
          <a target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSdScFpcZi7G5sjPo6RKsg6BYbV6PFiH9nMWoawRYIbAyRucnA/viewform?usp=sf_link">
              here
          </a>
      </p>
      <h3><img src="assets/GitHub-Mark-32px.png" /> Open Source <img src="assets/GitHub-Mark-32px.png" /></h3>
      <p>
          YouCanBenefit is an open source project. <a href="https://github.com/yeg-relief" target="_blank">Please check us out on Github.</a>
      </p>`
    },
    {
      guid: "2",
      content: `<h1><a href="https://www.linkedin.com/in/steven-myers-7b750789/" target="_blank">Steven Myers</a></h1>
      <div class="detail-section">
        <img src="assets/steven-profile.jpg" />
          <p>
              Steven volunteered the technical expertise by designing and implementing the application. He is a
              Computing Science graduate of the University of Alberta and is employed as a software developer
              in Edmonton, Alberta, Canada.
          </p>
      </div>`
    },
    {
      guid: "3",
      content: `<h2><a href="https://e4calberta.org/" target="_blank">e4c</a></h2>
      <div class="detail-section">
          <img src="assets/rsz_1mainlogo_55796721-010e-435f-9c40-0dc1a644656e.png" />
          <p>e4c is a non-profit, charitable organization that has been working for almost
              50 years to help vulnerable people here and now. At the same time, we’re working to
              prevent and eventually eliminate poverty. It’s a big task, but one we know is possible
              with the help of others who are ready to see the strength we see in the people we serve.
              Our organization’s areas of focus are shelter and housing, community and collaboration,
              skill development and education, and food security.
          </p>
      </div>`
    }
  ]
  editingDocuments = {}
  error = "";
  constructor(
    private aboutService: AboutService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.quillModules = {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'header': 1}, { 'header': 2}],
        [{ 'list': 'ordered'}, { 'list': 'bullet'}],
        [{ 'indent': '-1'}, { 'indent': '+1' }], 
        [{ 'align': [] }],
        ['link', 'image']
      ]
    }
    this.showEditButton = this.authService.isLoggedIn;
    // this.aboutService.getDocument().then((doc) => {
    //   this.dynamicDocument = doc
    // }, (err) => {
    //   this.error = err;
    // })
  }

  editDocument(guid) {
    if (!this.editingDocuments[guid]) {
      this.editingDocuments[guid] = true;
    } else {
      this.editingDocuments[guid] = false;
    }
  }

  addDocument() {
    this.documents.push({
      guid: this.randomString(),
      content: ""
    })
  }

  deleteDocument(guid) {
    const ind = this.documents.findIndex(doc => doc.guid == guid);
    this.documents.splice(ind, 1);
    delete this.editDocument[guid];
  }

  toggleEditMode() {
    if (!this.editMode) {
      this.editMode = true
    } else {
      this.editMode = false
    }
    for (const guid in this.editingDocuments) {
      this.editingDocuments[guid] = false;
    }
  }

  cancel() {
    // this.aboutService.getDocument();
    this.editMode = false;
  }

  private randomString() {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 20; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  }

}
