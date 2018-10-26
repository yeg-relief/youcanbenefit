import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdSidenav } from "@angular/material";
import { Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/filter'

@Component({
    selector: 'app-quick-links',
    templateUrl: './quick-links.component.html',
    styleUrls: ['./quick-links.component.css']
})
export class QuickLinksComponent implements OnInit, AfterViewInit {

    @ViewChild('sidenav') public myNav: MdSidenav;

    smallView: Observable<boolean>;

    fragments = {
        'documentation' : [
            {
                subtitle: 'Social Insurance Number',
                title: 'Social Insurance Number (SIN)',
                fragment: 'social-insurance-number',
                content: `
                <p>The Social Insurance Number (SIN) is a nine-digit number that you need to work in Canada
                    or to have access to government programs and benefits.To register for a SIN or 
                    to replace a missing SIN letter please visit 
                    <a target="_blank" href="https://www.canada.ca/en/employment-social-development/services/sin">
                        here
                    </a> 
                    or call 1-800-206-7218
                </p>`
            },
            {
                subtitle: 'Notice of Assessment',
                title: 'Notice of Assessment',
                fragment: 'notice-of-assessment',
                content: `
                <p>The Notice of Assessment is proof of your income from your last tax return. Many benefits 
                  ask for this to verify that you are eligible.To get a copy of your Notice of Assessment, 
                  contact the Canada Revenue Agency at 1-800-959-8281 or visit their 
                  <a target="_blank" href="https://www.cra-arc.gc.ca"> website </a> 
                </p>`
            },
            {
                subtitle: 'Alberta Health Insurance Card',
                title: 'Alberta Health Insurance Card',
                fragment: 'alberta-health-insurance-card',
                content: `
                <p>The Alberta Health Card allows almost all Albertans to access medical services like hospitals and doctors. 
                To replace a lost Health Card call 780-427-1432 or visit an Alberta Registry Office.
                To register for a Health Card call 780-427-1432 or visit 
                <a target="_blank" href="http://www.health.alberta.ca/AHCIP/register-for-AHCIP.html">
                    http://www.health.alberta.ca/AHCIP/register-for-AHCIP.html
                </a>
                </p>`
            },
            {
                subtitle: 'Birth Certificate',
                title: 'Birth Certificate',
                fragment: 'birth-certificate',
                content: `
                <p>To get a copy of your birth certificate, contact Service Alberta at 780-427-7013 or by visiting 
                <a target="_blank" href="https://www.servicealberta.ca/birth-certificates.cfm" target="_blank">
                  here
                </a>
                </p>`
            },
            {
                subtitle: 'Immigration Documents',
                title: 'Immigration Documents',
                fragment: 'immigration-documents',
                content: `
                <p>An Immigration Document or a Verification of Status (VoS) is used to prove that someone has legally immigrated to Canada and is eligible for benefits.
                You can get either one of these documents by calling 1-888-242-2100 or visiting 
                 <a target="_blank" href="http://www.cic.gc.ca/english/information/applications/certcopy.asp" target="_blank">
                  here
                 </a>
                </p>`
            },
            {
                subtitle: 'Direct Deposit Information',
                title: 'Direct Deposit Information',
                fragment: 'direct-deposit-information',
                content: `
                <p>
                    To sign up for direct deposit you can get the information you need from your bank. 
                    You need 3 numbers: your branch/transit number, Bank ID number, and your Account Number. 
                    You can get these with a direct deposit form from your bank or through your online banking.
                </p>`
            }
        ].sort((a, b) => a.title.localeCompare(b.title)),
        'supports': [
            {
                subtitle: '2-1-1',
                title: '2-1-1',
                fragment: 'two_one_one',
                content: `
                <p>
                    2-1-1 is a free, confidential, multilingual, 24 hour information and referral system. 2-1-1 provides information on government 
                    and community based health and social services. You can dial 2-1-1 to speak to an Information & Referral Specialist, or 
                    search the online community resource directory at <a target="_blank" href="http://www.ab.211.ca">www.ab.211.ca</a> 
                </p>
                `
            },
            {
                subtitle: 'Alternative Benefits Navigator',
                title: 'Federal/Provincial Benefits Navigator',
                fragment: 'federal-provincial-benefits',
                content: `
                <p> For a more comprehensive list of available federal and provincial 
                benefits check out the Government of Canada’s benefits navigator at 
                <a target="_blank" href="http://www.canadabenefits.gc.ca">www.canadabenefits.gc.ca</a>
                </p>
                `
            },
            {
                subtitle: 'Make Tax Time Pay',
                title: 'e4c Make Tax Time Pay',
                fragment: 'mttp',
                content: `
                <p>
                    e4c Make Tax Time Pay runs free tax clinics to help people in the Edmonton area with lower incomes get their 
                    taxes done for free and apply for benefits. Most clinics are open during March and April but some are open all year.
                    For a listing of currently available tax clinics please call 2-1-1
                </p>
                `
            },
            {
                subtitle: 'Child and Family Benefits Calculator',
                title: 'Child and Family Benefits Calculator',
                fragment: 'child-family-benefit-calculator',
                content: `
                <p>
                    You can use this calculator to see what child and family benefits you may be able to get and how much your payments may be. 
                    Check out the calculator at 
                    <a target="_blank" href="http://www.cra-arc.gc.ca/benefits-calculator/index.html">
                        www.cra-arc.gc.ca/benefits-calculator/index.html
                    </a>
                </p>
                `
            }
        ].sort((a, b) => a.title.localeCompare(b.title))
    };

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        const match = () => !(window.matchMedia("(min-width: 750px)").matches);

        this.smallView = Observable.fromEvent(window, 'resize')
            .map(match)
            .startWith(match());

    }

    ngAfterViewInit() {
        this.route.fragment.filter(f => !!f).subscribe(f => {
            const element = document.querySelector("#" + f);
            if (element) {
                element.scrollIntoView(true);
            } else {
                console.log(`can't find element: ${f}`);
            }

            if (this.myNav && this.myNav.opened) {
                this.myNav.close();
            }

        })
    }
}
