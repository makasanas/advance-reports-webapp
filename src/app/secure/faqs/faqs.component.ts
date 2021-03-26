import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FaqsService } from './faqs.service'


@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})

export class FaqsComponent implements OnInit {

  public faq = [false, false, false, false, false, false, false, false, false, false, false, false];

  public faqs= [
    {
      title:"How can I generate a tag?",
      ans: "Just Simply click on Add New Rule button and You can create new Rule depends on the category.",
      open:false
    },
    {
      
      title:"What is Dynamic tag?",
      ans: "The dynamic tag has a dynamic value that is real data value. We can also add Prefix and Suffix as per our requirements. For example : If want to create tag for “If value greater than 2 create tag [root_details.total_price] with prefixprice__ “ than tag will be “price__ [root_details.total_price]",
      open:false
    },
    {
      title:"How can I generate a dynamic tag?",
      ans: "Just Simply click on Add New Rule button and You can create new Rule depends on category with Prefix and Suffix.",
      open:false
    },
    {
      title:"Can I add more categories?",
      ans: "We have listed all possible category so you will not need to add. Still, you want to add then you can contact us. We will add to the list for you.",
      open:false
    },
    {
      title:"Can I edit the rule?",
      ans: "No, you can’t. But you can delete created rule and Create a new rule with your requirement.",
      open:false
    },
    {
      title:"Is this App has trial days to access?",
      ans:"Yes, This app provides you 14-day free trial.",
      open:false
    },
    {
      title:"What is the charge for installing this app?",
      ans:"The installation of this app is completely free and it will also give you 14-day free trial for experience the future.",
      open:false
    },
    {
      title:"Do you offer live chat support?",
      ans:"No, We do not have offer live chat support but our support team will be solve your any query within just 24 hours.",
      open:false
    },
    {
      title:"How do I remove the app?",
      ans:"You can uninstall the app from your shopify store admin just by clicking on trash icon on the app list page.",
      open:false
    },
    {
      title:"how can I contact the support?",
      ans:"You can easily contact with us on the provided contact email 24x7 and the support team will reach you ASAP.",
      open:false
    }
  ];
  public contactForm;
  public messageStatus;

  constructor(private formBuilder: FormBuilder, private faqsService: FaqsService) { 
    this.contactForm = this.formBuilder.group({
			userId: [''],
			email: [''],
			messageType: ['', Validators.required],
      message: ['', Validators.required],
      shopUrl:[''],
      messageFrom:['']
		});
  }

  ngOnInit() {
    this.faqsService.getUser().subscribe((res) => {
      this.contactForm.controls['email'].setValue(res.data.email);
      this.contactForm.controls['userId'].setValue(res.data._id);
      this.contactForm.controls['shopUrl'].setValue(res.data.shopUrl);
      this.contactForm.controls['messageFrom'].setValue(window.location.origin+" -  Faqs contacts");
    }, err => {
    });
  }

  changeActive(i) {
    this.faqs[i].open = !this.faqs[i].open;
  }


  sendMessage(){
    if (!this.contactForm.invalid) {
      this.faqsService.sendMessage(this.contactForm.value).subscribe((res) => {
        this.messageStatus = 'Thank you, We got your message.'
      }, err => {
        this.messageStatus = 'Something happen wrong please try again.';
      });
    }
    else {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key).markAsDirty();
      });
    }
  }
}