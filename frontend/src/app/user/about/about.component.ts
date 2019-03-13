import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';
import { AuthService } from 'src/app/admin/core/services/auth.service';
import { Page, Document } from '../../shared/models';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators'
import { QuillService } from '../quill/quill.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  quillEditor: any;
  quillModules = {};
  showEditButton = false;
  editMode = false;
  
  page: Page = {
    title: 'about',
    documents: [],
    created: -1
  }
  
  editingDocuments = {}
  constructor(
    private aboutService: AboutService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private quillService: QuillService
  ) {}

  ngOnInit() {

    this.quillModules = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline'],
          [{ 'header': 1}, { 'header': 2}],
          [{ 'list': 'ordered'}, { 'list': 'bullet'}],
          [{ 'indent': '-1'}, { 'indent': '+1' }], 
          [{ 'align': [] }],
          ['link', 'image']
        ],
        handlers: {
          'image': () => { this.quillService.uploadImage(this.quillEditor) }
        }
      }
    }
    this.showEditButton = this.authService.isLoggedIn;

    this.page.documents = [
      {
        guid: this.randomString(),
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
        guid: this.randomString(),
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
        guid: this.randomString(),
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
      },
      {
        guid: this.randomString(),
        content: `<h2><a href="https://www.edmonton.ca/" target="_blank">City of Edmonton</a> </h2>
        <div class="detail-section">
              <img src="assets/city-of-edmonton.jpg" />    
              <p>
                As the government closest to Canadians, municipalities touch almost every aspect of our citizens’ daily lives.
                We’re citizens too - 12,000 employees who provide services to our nearly 900,000 neighbours in the most open
                and responsive way we can.
                <br><br>
                The City of Edmonton doesn't do this alone. We’re part of a larger ecosystem of government, post-secondary institutions, the arts,
                not-for-profits, school boards, private business and citizens —  integral partners in an intelligent community.
                Embracing the perspectives from individuals, industry and academic sectors is how we can best achieve our goals,
                deliver programs and services and provide an exceptional quality of life for citizens.
            </p>
            
        </div>`
      },
      {
        guid: this.randomString(),
        content: `
          <h2><a href="http://www.endpovertyedmonton.ca" target="_blank">EndPovertyEdmonton</a> </h2>
          <div class="detail-section">
              <img src="assets/end-poverty.png" />
              <p> EndPovertyEdmonton is a community-based collective launched in 2017 to steward the vision and movement to end poverty in
                  Edmonton in a generation and to advance the actions in the five year EndPovertyEdmonton Road Map.  Road Map Action #16
                  specifically calls for an expansion of the spectrum of financial empowerment initiatives, of which You Can Benefit,
                  is an outstanding example.</p>
          </div>`
      },
      {
        guid: this.randomString(),
        content: `
          <h2><a href="https://betacity.ca/" target="_blank">BETA CITY YEG</a></h2>
            <div class="detail-section">
                <p>BetaCityYEG is Canada's oldest civic technology meetup and meets monthly at <a href="http://www.startupedmonton.com/" target="_blank">Startup Edmonton</a>. It brings together
                    civic-minded data scientists, programmers, and public and nonprofit employees to co-create solutions for the city and region.
                </p>
            </div>`
      },
      {
        guid: this.randomString(),
        content: `
          <h2>Disclaimer</h2>
          <div class="detail-section">
              <p>YouCanBenefit contains information provided by a variety of parties.  YouCanBenefit does not make any representations or warranty about 
                  the accuracy, reliability, currency or completeness of the information provided. YouCanBenefit does not endorse the information contained 
                  herein and will not be liable for any reliance thereon.
              </p>
          </div>`
      }
      
    ]

    // this.aboutService.getPage()
    //                   .then((page: Page) => this.page.documents = page.documents)
    //                   .catch(err => console.log(err));
  }

  editorCreated(editor: any) {
    this.quillEditor = editor;
    console.log(this.quillEditor);
  }

  editDocument(guid) {
    if (!this.editingDocuments[guid]) {
      this.editingDocuments[guid] = true;
    } else {
      this.editingDocuments[guid] = false;
    }
  }

  addDocument() {
    this.page.documents.push({
      guid: this.randomString(),
      content: ""
    })
  }

  deleteDocument(guid) {
    const ind = this.page.documents.findIndex(doc => doc.guid == guid);
    this.page.documents.splice(ind, 1);
    delete this.editDocument[guid];
  }

  toggleEditMode() {
    if (!this.editMode) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
    for (const guid in this.editingDocuments) {
      this.editingDocuments[guid] = false;
    }
  }

  savePage() {
    this.aboutService.savePage(this.page)
                      .pipe(take(1))
                        .subscribe(
                          val => {
                            if(val.result === 'created' || val.result === 'updated') {
                                this.snackBar.open('page saved.', '', { duration: 2000 });
                            }else{
                                this.snackBar.open('error: page not saved.', '', { duration: 2000 });
                            }
                        },
                          err => {
                            this.snackBar.open('error: page not saved.', '', { duration: 2000 });
                          }
                        );
  }

  cancel() {
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
