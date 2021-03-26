import { Component, OnInit } from "@angular/core";
import { environment } from "./../../../environments/environment";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TagService } from "./tag.service";
import { GetDataService } from "./../../services/get-data.service";

@Component({
  selector: "app-tag-list",
  templateUrl: "./tag-list.component.html",
  styleUrls: ["./tag-list.component.scss"]
})
export class TagListComponent implements OnInit {
  public categories: any;
  public orderVariables: any;
  public salesReport: any = [
    {
      name: "Sales By Month",
      group: "_id: {Country: '$shopifyData.shipping_address.country'}",
      column: [
        {
          leble: "Month of order",
          type: "$sum"

          // filed:data.discount
        }
      ]
    },
    {
      name: "sale by shca v",
      group: [],
      field: []
    }
  ];

  public compDataTypes = [
    {
      title: "String",
      id: "string"
    },
    {
      title: "Numbers",
      id: "number"
    },
    {
      title: "None",
      id: "none"
    }
  ];
  public tagTypes = [
    {
      title: "Static",
      id: "static"
    },
    {
      title: "Dynamic",
      id: "dynamic"
    }
  ];
  public compTypes: any = [];
  public createRuleForm: FormGroup;
  public nestedRuleForm: any;
  public popup = {
    createRuleForm: false,
    updateRuleForm: false
  };
  public tagRulesPage = {
    limit: 10,
    offset: 0,
    count: 100
  };
  public tagRules: any;
  public dataList: any = [];
  public reportData: any = {};
  public loading: boolean;
  public askForHelpPopup: boolean = false;
  public formType: any = "add";
  public updateId: any;
  public tagList: any;

  constructor(
    private _dataService: GetDataService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private _tagService: TagService
  ) {
    this.createRuleForm = this.formBuilder.group({
      selector: ["", Validators.required],
      compDataType: "",
      compType: "",
      compValue: {},
      compMin: ["", Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")],
      compMax: ["", Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")],
      compText: "",
      tagType: new FormControl("static"),
      tagValue: ["", Validators.required],
      tagPrefix: "",
      tagSuffix: "",
      dynamicSelector: "",
      dynamicItem: "",
      item: {
        isEditable: false
      }
    });
    // this.nestedRuleForm = this.formBuilder.array([]);
    this.nestedRuleForm = this.formBuilder.group({
      isCondition: true,
      compType: "and",
      compList: this.formBuilder.array([])
    });

    let tmpaskForHelpPopup =
      localStorage.getItem("askForHelpPopup") == "true" ? true : false;
    this.askForHelpPopup = tmpaskForHelpPopup ? true : false;
    this.tagList = {
      isCondition: true,
      compType: "and",
      tagStageNo: 0,
      compList: [
        {
          isCondition: false,
          tagStageNo: 1,
          compList: [
            {
              tagStageNo: 2,
              compTitle: "year",
              compValue: {
                includes: "2017"
              }
            }
          ]
        },
        {
          isCondition: false,
          tagStageNo: 1,
          compList: [
            {
              tagStageNo: 2,
              compTitle: "std",
              compValue: {
                includes: "9"
              }
            }
          ]
        },
        {
          isCondition: true,
          tagStageNo: 1,
          compType: "or",
          compList: [
            {
              isCondition: true,
              tagStageNo: 2,
              compType: "and",
              compList: [
                {
                  tagStageNo: 3,
                  isCondition: false,
                  compList: [
                    {
                      parameter: "product title",
                      condition: "isEqul",
                      value: 10,
                      tagStageNo: 4,
                      compTitle: "exam",
                      compValue: {
                        includes: "halfyr_T"
                      }
                    }
                  ]
                },
                {
                  isCondition: false,
                  tagStageNo: 3,
                  compList: [
                    {
                      tagStageNo: 4,
                      compTitle: "marks",
                      compValue: {
                        includes: 25
                      }
                    }
                  ]
                }
              ]
            },
            {
              isCondition: false,
              tagStageNo: 2,
              compList: [
                {
                  tagStageNo: 3,
                  compTitle: "exam",
                  compValue: {
                    includes: "annual_T"
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  }

  ngOnInit() {
    this.getAllRules();
    this.getData();

    let control = this.nestedRuleForm.get("compList") as FormArray;

    this.addFromArray(control, "or", false);
  }

  createItem(type, isCondition): FormGroup {
    return this.formBuilder.group({
      isCondition: isCondition,
      tagStageNo: 0,
      compType: type,
      fieldType: "",
      fieldCondition: "",
      fieldValue: "",
      compList: this.formBuilder.array([])
    });
  }

  createValueItem(value): FormGroup {
    return this.formBuilder.group({
      isCondition: value.isCondition,
      tagStageNo: 0,
      compType: value.compType,
      fieldType: value.fieldType,
      fieldCondition: value.fieldCondition,
      fieldValue: value.fieldValue,
      compList: this.formBuilder.array([])
    });
  }

  // createSinleItem(type): FormGroup {
  //   return this.formBuilder.group({
  //     isCondition: true,
  //     tagStageNo: 0,
  //     compType: type,
  //     compList: this.formBuilder.array([
  //       { fieldType: "", fieldCondition: "", fieldValue: "" }
  //     ])
  //   });
  // }

  addFromArray(control, type, isCondition): void {
    console.log(control);
    return control.push(this.createItem(type, isCondition));
  }

  removeAddFromArray(controls, index, control, type, isCondition): void {
    console.log(controls);
    console.log(index);
    controls[index].controls.isCondition.setValue(true);

    let value = {
      isCondition: false,
      compType: type,
      fieldType: controls[index].get("fieldType"),
      fieldCondition: controls[index].get("fieldCondition"),
      fieldValue: controls[index].get("fieldValue")
    };

    console.log(value);

    if (control.length >= 2) {
      control.push(this.createItem(type, isCondition));
    } else {
      control.push(this.createValueItem(value));
      control.push(this.createItem(type, isCondition));
    }
    console.log(this.nestedRuleForm);

    // let form = controls as FormArray;
    // cons
    // form.indexOf(index)
  }

  removeFromArray(controls, index): void {
    console.log("controls", controls);
    let form = controls as FormArray;
    console.log(form);
    while (form.length !== 0) {
      form.removeAt(index);
    }
    console.log("remove", this.nestedRuleForm);
  }

  // createItem(control, index) {
  //   let formArray = control ? control.compList : [];
  //   return this.formBuilder.group({
  //     isCondition: false,
  //     tagStageNo: index,
  //     compList: formArray
  //   });
  // }

  // addPrice(controls) {
  //   let form = controls as FormArray;
  //   return form.push(this.createItem());
  // }

  // addFromArray(formArray, index) {
  //   let form = formArray as FormArray;
  //   return form.push(this.createItem());
  // }

  getData() {
    this.dataList = [];
    this.reportData = {};
    this._dataService.getJSON().subscribe(data => {
      this.dataList = data.list;
    });
    this._dataService.getReportDataJSON().subscribe(data => {
      this.reportData = data;
    });
  }

  changePopup(form, status) {
    this.popup[form] = status;
    if (form == "updateRuleForm") {
    } else {
      this[form].reset();
      this.compTypes = [];
      if (form == "createRuleForm") {
        this[form].controls.tagType.setValue("static");
        this[form].controls.item.setValue({ isEditable: false });
      }
    }
  }

  onCompDataTypeChange(type) {
    if (type == "string") {
      this.compTypes = [
        {
          title: "Includes",
          id: "includes"
        },
        {
          title: "Is equals",
          id: "eq"
        }
      ];
    } else if (type == "number") {
      this.compTypes = [
        {
          title: "Greater Than",
          id: "gt"
        },
        {
          title: "Less Than",
          id: "lt"
        },
        {
          title: "In Between",
          id: "bt"
        },
        {
          title: "Is equal",
          id: "eq"
        }
      ];
    } else {
      this.compTypes = [];
    }
  }

  onChangeOrderVariable(event) {
    console.log("event.target.value", event.target.value);
    this.createRuleForm.controls.compDataType.reset();
    let foundMain = this.dataList.find(function(element) {
      return element.value == event.target.value.split(".")[0];
    });
    console.log("foundMain", foundMain);
    let found = foundMain.subItems.find(function(element) {
      return element.value == event.target.value;
    });
    this.createRuleForm.controls.item.setValue(found);
    this.createRuleForm.controls.compDataType.setValue(found.type);
    this.onCompDataTypeChange(this.createRuleForm.controls.compDataType.value);
    console.log("selector", this.createRuleForm.controls);
  }

  onChangeDynamicValue(event) {
    let foundMain = this.dataList.find(function(element) {
      return element.value == event.target.value.split(".")[0];
    });
    let found = foundMain.subItems.find(function(element) {
      return element.value == event.target.value;
    });
    this.createRuleForm.controls.dynamicItem.setValue(found);
  }

  onTagTypeChange() {
    if (this.createRuleForm.controls.tagType.value == "dynamic") {
      this.changeFormValidation("createRuleForm", "tagValue", "remove");
      this.createRuleForm.controls.tagValue.setValue("");
    } else if (this.createRuleForm.controls.tagType.value == "static") {
      this.changeFormValidation("createRuleForm", "tagValue", "add");
      this.createRuleForm.controls.dynamicSelector.setValue("");
      this.createRuleForm.controls.tagPrefix.setValue("");
      this.createRuleForm.controls.tagSuffix.setValue("");
    }
  }

  changeFormValidation(form, control, status) {
    if (status == "add") {
      this[form].controls[control].setValidators([Validators.required]);
    } else {
      this[form].controls[control].clearValidators();
    }
    this[form].controls[control].updateValueAndValidity();
  }

  reset(form, controls) {
    controls.forEach((element, index) => {
      this[form].controls[element] ? this[form].controls[element].reset() : "";
    });
  }

  createForm(form, type) {
    if (this.createRuleForm.valid) {
      this.createRuleForm.value.compValue = {};
      if (this.createRuleForm.value.compDataType == "number") {
        if (this.createRuleForm.value.compType == "gt") {
          this.createRuleForm.value.compValue[
            "compMin"
          ] = this.createRuleForm.value.compMin;
        } else if (this.createRuleForm.value.compType == "lt") {
          this.createRuleForm.value.compValue[
            "compMax"
          ] = this.createRuleForm.value.compMax;
        } else if (this.createRuleForm.value.compType == "bt") {
          this.createRuleForm.value.compValue[
            "compMin"
          ] = this.createRuleForm.value.compMin;
          this.createRuleForm.value.compValue[
            "compMax"
          ] = this.createRuleForm.value.compMax;
        } else if (this.createRuleForm.value.compType == "eq") {
          this.createRuleForm.value.compValue[
            "compEqual"
          ] = this.createRuleForm.value.compMin;
        }
      } else if (this.createRuleForm.value.compDataType == "string") {
        if (this.createRuleForm.value.compType == "includes") {
          this.createRuleForm.value.compValue[
            "compText"
          ] = this.createRuleForm.value.compText;
        } else if (this.createRuleForm.value.compType == "eq") {
          this.createRuleForm.value.compValue[
            "compText"
          ] = this.createRuleForm.value.compText;
        }
      }
      if (type == "add") {
        this.addNewRule(form);
      } else {
        this.updateRule(form);
      }
    } else {
      console.log("invalid form");
      this.markFormGroupTouched(this.createRuleForm);
    }
  }

  addNewRule(form) {
    console.log("this[form].value", this[form].value);
    this.tagList.compList.push({
      isCondition: false,
      tagStageNo: 1,
      compList: [
        {
          tagStageNo: 2,
          compTitle: this[form].value.item.title,
          compValue: {
            includes: this[form].value.compValue.compText
          }
        }
      ]
    });

    const tagObj = {
      $match: this.updateTagObjList(this.tagList)
    };

    console.log(tagObj);
    // {
    //   "$match":{
    //     "$and":[
    //       {"$or":[
    //         {"exam":"halfyr_T","marks.p":{"$gte":"25"}},
    //         {"exam":"annual_T","marks.p":{"$gte":"35"}}
    //       ]},
    //       {"std":"9"},
    //       {"year":"2017"}
    //     ]
    //  }
    console.log(this.tagList);
    this.changePopup("createRuleForm", false);
    // compList: [
    //   {
    //     compTitle: "exam",
    //     compValue: {
    //       includes: "annual_T"
    //     }
    //   }
    // ]

    // this._tagService.addNewRule(this[form].value).subscribe(
    //   res => {
    //     this.getAllRules();
    //     this.changePopup("createRuleForm", false);
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  }

  updateTagObjList(tagList) {
    if (tagList.isCondition) {
      const list = tagList.compList.map(tag => {
        return this.updateTagObjList(tag);
      });
      return {
        [tagList.compType]: list
      };
    } else {
      return {
        [tagList.compList[0].compTitle]: tagList.compList[0].compValue.includes
      };
    }
  }

  updateRule(form) {
    let data = { id: this.updateId, data: this[form].value };
    this._tagService.udpateRule(data).subscribe(
      res => {
        this.getAllRules();
        this.changePopup("updateRuleForm", false);
      },
      err => {
        console.log(err);
      }
    );
  }

  getAllRules() {
    this.loading = true;
    this._tagService.getRules().subscribe(
      res => {
        this.tagRules = res.data;
        this.loading = false;
      },
      err => {
        console.log(err);
      }
    );
  }

  removeRule(id) {
    this._tagService.removeRule(id).subscribe(
      res => {
        console.log(res);
        this.getAllRules();
      },
      err => {
        console.log(err);
      }
    );
  }

  editRule(rule) {
    this.updateId = rule._id;
    this.changePopup("updateRuleForm", true);
    this.createRuleForm.controls.selector.setValue(rule.selector);
    let event = {
      target: {
        value: rule.selector
      }
    };
    this.onChangeOrderVariable(event);
    this.onCompDataTypeChange(rule.compDataType);
    this.createRuleForm.controls.compType.setValue(rule.compType);
    if (rule.compDataType == "number") {
      if (rule.compType == "gt") {
        this.createRuleForm.controls.compMin.setValue(rule.compValue.compMin);
      } else if (rule.compType == "lt") {
        this.createRuleForm.controls.compMax.setValue(rule.compValue.compMax);
      } else if (rule.compType == "bt") {
        this.createRuleForm.controls.compMin.setValue(rule.compValue.compMin);
        this.createRuleForm.controls.compMax.setValue(rule.compValue.compMax);
      } else if (rule.compType == "eq") {
        this.createRuleForm.controls.compEqual.setValue(
          rule.compValue.compEqual
        );
      }
    } else if (rule.compDataType == "string") {
      if (rule.compType == "includes") {
        this.createRuleForm.controls.compText.setValue(rule.compValue.compText);
      } else if (rule.compType == "eq") {
        this.createRuleForm.controls.compText.setValue(rule.compValue.compText);
      }
    }
    this.createRuleForm.controls.tagType.setValue(rule.tagType);
    this.onTagTypeChange();
    if (rule.tagType == "static") {
      this.createRuleForm.controls.tagValue.setValue(rule.tagValue);
    }
    if (rule.tagType == "dynamic") {
      this.createRuleForm.controls.dynamicSelector.setValue(
        rule.dynamicSelector
      );
      let tmpEvent = { target: { value: rule.dynamicSelector } };
      this.onChangeDynamicValue(tmpEvent);
      this.createRuleForm.controls.tagPrefix.setValue(rule.tagPrefix);
      this.createRuleForm.controls.tagSuffix.setValue(rule.tagSuffix);
    }
  }

  alap = {
    country: [
      {
        field: "_id",
        fieldType: "Country",
        value: "shipping_address.country"
      },
      {
        field: "count",
        fieldType: "total",
        value: "1"
      },
      {
        field: "discount",
        fieldType: "total",
        value: "total_discounts"
      },
      {
        field: "totalAmount",
        fieldType: "total",
        value: "total_price"
      },
      {
        field: "netAmount",
        fieldType: "total",
        value: "subtotal_price"
      }
    ]
  };

  salesRepost(reportType) {
    let fields = [
      {
        type: "Discount",
        operationType: "$sum"
      },
      {
        type: "Total Amount",
        operationType: "$sum"
      },
      {
        type: "Net Amount",
        operationType: "$sum"
      },
      {
        type: "Total quantity",
        operationType: "$sum"
      },
      // {
      //   type: "Customer First Name",
      //   operationType: "$first"
      // },
      // {
      //   type: "Customer Last Name",
      //   operationType: "$first"
      // },
      {
        type: "Total tax amount",
        operationType: "$sum"
      },
      {
        type: "Total tax name",
        operationType: "$first"
      },
      {
        type: "Total products",
        operationType: "$sum"
      }
    ];

    let reportObject = {
      _id: { [reportType]: this.reportData[reportType].value },
      count: { $sum: 1 }
    };

    fields.forEach(field => {
      reportObject = {
        ...reportObject,
        [field.type]: this.getReportValue(
          field.operationType,
          this.reportData[field.type]
        )
      };
    });

    // {
    //   $unwind: this.reportData[reportType].unwind
    // },

    let query = this.reportData[reportType].unwind
      ? [
          {
            $unwind: this.reportData[reportType].unwind
          },
          {
            $group: reportObject
          }
        ]
      : [
          {
            $group: reportObject
          }
        ];

    // console.log("reportObject", reportObject);

    this._tagService.getReport(query).subscribe(
      res => {
        console.log(res);
        // this.getAllRules();
      },
      err => {
        console.log(err);
      }
    );
  }

  getReportValue(operationType, field) {
    if (operationType === null) {
      return field.value;
    } else {
      return this.getRepotObj(operationType, field);
    }
  }

  getRepotObj(operationType, field) {
    if (field.valueOperation === null) {
      return { [operationType]: field.value };
    } else {
      return { [operationType]: { [field.valueOperation]: field.value } };
    }
  }

  getObjValue(fieldType, value) {
    if (fieldType === "total" && value !== 1) {
      return { $toDecimal: value };
    } else {
      return value;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  closeAskForHelpPopup() {
    this.askForHelpPopup = false;
    localStorage.setItem("askForHelpPopup", "false");
  }
}

// db.getCollection("orders").aggregate([
//   {
//     $group: {
//       _id: { country: "$shopifyData.shipping_address.country" },
//       count: { $sum: 1 },
//       tax: { $sum: { $toDecimal: "$shopifyData.total_tax" } },
//       quantity: { $sum: { $sum: "$shopifyData.line_items.quantity" } },
//       total: {
//         $push: {
//           $arrayToObject: {
//             $map: {
//               input: "$shopifyData.tax_lines",
//               as: "i",
//               in: {
//                 k: "$$i.title",
//                 v: "$$i.title"
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// ]);

// db.getCollection('orders').aggregate(
//   [
//     {
//       "$group": {
//         "_id": {
//           "Sales by Month": {
//             "$month": {
//               "date": "$created"
//             }
//           }
//         },
//         "Number of Orders": {
//           "$sum": 1
//         },

//        total: {
//         $push: { item: "$shopifyData.email", 'Total Amount': {"$sum": {
//           "$toDecimal": "$shopifyData.total_price"
//         }} }
//         }
//       }
//     }
//   ]
//   )

// db.getCollection("orders").aggregate([
//   {
//     $unwind : "$shopifyData.tax_lines"
//   }
//   {
//     $group: {
//       _id: { country: "$shopifyData.shipping_address.country" },
//       count: { $sum: 1 },
//       tax: { $sum: { $toDecimal: "$shopifyData.total_tax" } },
//       quantity: { $sum: { $sum: "$shopifyData.line_items.quantity" } },
//       taxName: {
//         $push: "$shopifyData.tax_lines.title"
//       }
//     }
//   }
// ]);

//https://github.com/makasanas/pricing-by-country-webapp/blob/master/src/app/secure/product/product-varient/product-varient.component.ts
