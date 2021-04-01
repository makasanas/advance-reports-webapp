import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter
} from "@ng-bootstrap/ng-bootstrap";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray
} from "@angular/forms";
import { SecureService } from "./../secure.service";
import { GetDataService } from "./../../services/get-data.service";
import { SalesReportService } from "./salesReport.service";

@Component({
  selector: "app-salesReport",
  templateUrl: "./salesReport.component.html",
  styleUrls: ["./salesReport.component.scss"]
})
export class SalesReportComponent implements OnInit {
  public reportData: any = {};
  public reportName: string = "";
  public reportType: string = "";
  public reportRestList: any = [];
  public tableColumn: any = [];
  // public isFilterPopUp: boolean = false;
  // public filterList: any = [];
  public popup = {
    isFilterPopUp: false,
    isColumnField: false
  };
  public filterList: any;
  public nestedRuleForm: any;
  public columnForm: any = [];
  public compTypes: any = [];
  public dataList: any = [];
  public startDate: any = null;
  public endDate: any = null;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private secureService: SecureService,
    private _dataService: GetDataService,
    private formBuilder: FormBuilder,
    private _salesReportService: SalesReportService,
    private calendar: NgbCalendar,
    public ngbDateParserFormatter: NgbDateParserFormatter
  ) {
    this.nestedRuleForm = this.formBuilder.group({
      isCondition: true,
      compType: "and",
      compList: this.formBuilder.array([])
    });
    this.columnForm = this.formBuilder.array([]);
    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), "d", 10);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.reportName = params.name;
      this.reportType = params.type;
    });
    this.getData();
    // let control = this.nestedRuleForm.get("compList") as FormArray;

    // this.addFromArray(control, "or", false);
  }

  getData() {
    this.dataList = [];
    this._dataService.getJSON().subscribe(data => {
      this.dataList = data.list;
    });

    this.reportData = {};
    this._dataService.getReportDataJSON().subscribe(data => {
      this.reportData = data;
      this.salesReport();
    });
  }

  createItem(type, isCondition): FormGroup {
    return this.formBuilder.group({
      isCondition: isCondition,
      tagStageNo: 0,
      compType: type,
      fieldType: "",
      fieldCondition: "",
      fieldValue: "",
      type: "",
      compList: this.formBuilder.array([])
    });
  }

  addFromArray(control, type, isCondition): void {
    return control.push(this.createItem(type, isCondition));
  }

  createColumItem(): FormGroup {
    return this.formBuilder.group({
      type: "",
      operationType: "",
      fieldType: ""
    });
  }

  addColumnArray(control): void {
    return control.push(this.createColumItem());
  }

  createValueItem(value): FormGroup {
    return this.formBuilder.group({
      isCondition: value.isCondition,
      tagStageNo: 0,
      compType: value.compType,
      fieldType: value.fieldType,
      fieldCondition: value.fieldCondition,
      fieldValue: value.fieldValue,
      type: value.type,
      compList: this.formBuilder.array([])
    });
  }

  removeAddFromArray(controls, index, control, type, isCondition): void {
    controls[index].controls.isCondition.setValue(true);

    let value = {
      isCondition: false,
      compType: type,
      fieldType: controls[index].get("fieldType"),
      fieldCondition: controls[index].get("fieldCondition"),
      fieldValue: controls[index].get("fieldValue"),
      type: controls[index].get("type")
    };

    if (control.length >= 2) {
      control.push(this.createItem(type, isCondition));
    } else {
      control.push(this.createValueItem(value));
      control.push(this.createItem(type, isCondition));
    }
  }

  toggleFilterPopUp(form) {
    this.popup[form] = !this.popup[form];
  }

  onChangeOrderVariable(event, control) {
    let foundMain = this.dataList.find(function(element) {
      return element.value == event.target.value.split(".")[1];
    });

    let found = foundMain.subItems.find(function(element) {
      return element.value == event.target.value;
    });
    control.get("type").setValue(found.type);
  }

  onChangeDynamicValue(event) {
    // let foundMain = this.dataList.find(function(element) {
    //   return element.value == event.target.value.split(".")[0];
    // });
    // let found = foundMain.subItems.find(function(element) {
    //   return element.value == event.target.value;
    // });
    // this.createRuleForm.controls.dynamicItem.setValue(found);
  }

  applyFilter() {
    this.toggleFilterPopUp("isFilterPopUp");
    this.salesReport();
  }

  addColumns() {
    this.toggleFilterPopUp("isColumnField");
    this.salesReport();
  }

  onCompDataTypeChange(type) {
    if (type == "string") {
      this.compTypes = [
        {
          title: "Includes",
          id: "$regexFind"
        },
        {
          title: "Is equals",
          id: "$regexMatch"
        }
      ];
    } else if (type == "number") {
      this.compTypes = [
        {
          title: "Greater Than",
          id: "$gt"
        },
        {
          title: "Greater Than and Equal",
          id: "$gte"
        },
        {
          title: "Less Than",
          id: "$lt"
        },
        {
          title: "Less Than and Equal",
          id: "$lte"
        },
        {
          title: "Is equal",
          id: "$eq"
        }
      ];
    } else {
      this.compTypes = [];
    }
    return this.compTypes;
  }

  salesReport() {
    let filter = {
      filterType: "$and",
      filterList: [
        // {
        //   filterEle: "$shopifyData.total_price",
        //   filterEleType: "number",
        //   filterCompType: "$lte",
        //   compValue: "90"
        // }
        // {
        //   filterEle: "$shopifyData.email",
        //   filterEleType: "string",
        //   filterCompType: "$regexFind",
        //   compValue: "Gmail"
        // }
      ]
    };

    if (this.startDate && this.endDate) {
      filter.filterList.push({
        filterEle: "$shopifyData.created_at",
        filterEleType: "date",
        filterCompType: "$gte",
        compValue: this.startDate
      });
      filter.filterList.push({
        filterEle: "$shopifyData.created_at",
        filterEleType: "date",
        filterCompType: "$lte",
        compValue: this.endDate
      });
    }

    if (this.nestedRuleForm.value.compList.length > 0) {
      this.nestedRuleForm.value.compList.forEach(filterItem => {
        filter.filterList.push({
          filterEle: filterItem.fieldType,
          filterEleType:
            filterItem.fieldCondition === "$regexFind" ||
            filterItem.fieldCondition === "$regexMatch"
              ? "string"
              : "number",
          filterCompType: filterItem.fieldCondition,
          compValue: filterItem.fieldValue,
          isArray: this.getFilterType(filterItem.fieldType)
        });
      });
    }

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
      {
        type: "Total tax amount",
        operationType: "$sum"
      }
    ];

    let reportObject = {
      _id: { [this.reportName]: this.reportData[this.reportName].value },
      "Number of Orders": { $sum: 1 }
    };

    let matchList = filter.filterList.map(filter => {
      if (filter.isArray) {
        return this.matchListForArrayFilter(filter);
      } else {
        return {
          $expr: {
            [filter.filterCompType]: this.getFilterExp(filter)
          }
        };
      }
    });

    let matchQuery =
      filter.filterList.length > 0
        ? {
            [filter.filterType]: matchList
          }
        : {};

    fields.forEach(field => {
      reportObject = {
        ...reportObject,
        [field.type]: this.getReportValue(
          field.operationType,
          this.reportData[field.type]
        )
      };
    });

    let query = this.reportData[this.reportName].unwind
      ? [
          {
            $unwind: this.reportData[this.reportName].unwind
          },
          {
            $match: matchQuery
          },
          {
            $group: reportObject
          }
        ]
      : [
          {
            $match: matchQuery
          },
          {
            $group: reportObject
          }
        ];

    this._salesReportService.getReport(query).subscribe(
      res => {
        this.tableColumn = Object.keys(res.data[0]).map((column, id) => {
          return {
            name: column,
            prop: column.toLowerCase().replace(/\s/g, "")
          };
        });
        this.reportRestList = res.data.map(res => {
          let resObj = {};
          this.tableColumn.forEach(col => {
            resObj = {
              ...resObj,
              [col.prop]:
                res[col.name] !== null && typeof res[col.name] === "object"
                  ? res[col.name][Object.keys(res[col.name])[0]]
                  : res[col.name]
            };
          });
          return resObj;
        });

        this.tableColumn[0].name = this.reportName;
      },
      err => {
        console.log(err);
      }
    );
  }

  getFilterType(filter) {
    let foundMain = this.dataList.find(function(element) {
      return element.value == filter.split(".")[1];
    });

    let found = foundMain.subItems.find(function(element) {
      return element.value == filter;
    });
    return found.isArray;
  }

  matchListForArrayFilter(filter) {
    var a = filter.filterEle;
    var nameSplit = a.split(".");
    nameSplit.pop();
    var name = nameSplit.join(".").substring(1);

    return {
      [name]: {
        $elemMatch: {
          [filter.filterEle.split(".")[2]]:
            filter.filterEleType === "number"
              ? { [filter.filterCompType]: filter.compValue }
              : new RegExp(filter.compValue, "i")
        }
      }
    };
  }

  getFilterExp(filter) {
    if (filter.filterEleType === "number") {
      return [{ $toDecimal: filter.filterEle }, Number(filter.compValue)];
    } else if (filter.filterEleType === "date") {
      return [
        { $toDate: filter.filterEle },
        {
          $toDate: new Date(filter.compValue)
        }
      ];
    } else {
      return {
        input: filter.filterEle,
        regex: `${filter.compValue}`,
        options: filter.filterCompType === "$regexFind" ? "i" : "m"
      };
    }
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

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.startDate = this.formateDate(this.fromDate);
    this.endDate = this.toDate && this.formateDate(this.toDate);
    this.salesReport();
  }

  formateDate(date: NgbDate) {
    let myDate = this.ngbDateParserFormatter.format(date);
    let d = new Date(myDate);
    return d.toISOString();
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
}

// '$match' :{ $expr: { $lte: [ { $toDecimal: "$shopifyData.total_price" }, 400.0 ] } }
// '$match' :{ $expr: { $regexFind: {input :"$shopifyData.email", regex: /ravi/ } } }
// '$match' : {
//   $and: [
//     { $expr: { $lte: [ {$toDate : '$created' }, ISODate('2021-03-07T00:00:00.000Z') ] }},
//     { $expr: { $gte: [ {$toDate :'$created' }, ISODate('2021-03-01T00:00:00.000Z') ] }},
//   ]
// }

// $match: {
//   $and: [
//     {
//       'shopifyData.line_items': {
//         $elemMatch: {
//           title: /Wrench/,
//         },
//       },
//     },
//   ],
// },
