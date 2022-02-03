import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, TemplateRef, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'rxjs/add/operator/map';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
const { read, write, utils } = XLSX;

type AOA = any[][];

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    // var dateuse = '0' + date.day
    // var monthuse = '0' + date.month
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : '';
  }
}

@Component({
  selector: 'app-export-raw-byimport',
  templateUrl: './export-raw-byimport.component.html',
  styleUrls: ['./export-raw-byimport.component.scss'],
  providers: [

    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class ExportRawByimportComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtOptionsBundle: DataTables.Settings = {};
  stocks = [];
  uomts = [];
  modalRef: BsModalRef;
  dtTrigger: Subject<any> = new Subject<any>();
  Product_ID;
  Product_Name;
  Product_Active: boolean;
  Product_Active_ID: any;
  ddlUOMs: any[];
  ddlRAWs: any[];
  Bundle_ID;
  ProductID_1;
  ProductID_2;
  Quantity_1;
  Quantity_2;
  RAW_ID;
  ProductType: any;
  private myEventSubscription: any;
  private myEventSubscription1: any;
  items: Array<any> = [];
  newItemStock: any = {};
  item_raw_name: any;
  item_uom_id: any;
  item_uom_name: any;
  Barcode: any;
  UOM_ID: any;
  CheckAddBundle: any;

  item_raw_id: any;
  item_barcode: any;
  item_quantity: any;
  item_price: any;
  Stock_ID: any;
  doc_no: any;
  remark: any;
  chkDraft: any;

  toggle = false;
  model1: string;
  model2: string;

  // doc_date: any;
  linecount: any;
  doc_date: NgbDateStruct;

  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };





  constructor(private http: HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    console.log("Ok")
    this.getStocks()
    this.getddlUOMs();
    this.getddlRAWs();


  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }

    if (this.myEventSubscription) {
      this.myEventSubscription.unsubscribe();
    }

    if (this.myEventSubscription1) {
      this.myEventSubscription1.unsubscribe();
    }

    console.log("Destroy")
  }

  getStocks() {
    let json = {
      type_id: 3
    }

    this.myEventSubscription = this.apiService.restApiSendParm("http://localhost:8080/stock/getStocks", JSON.stringify(json))
      .subscribe(
        data => {
          //this.products = (data as any).data ;
          this.stocks = data['data'];
          // console.log(this.products)
          this.dtTrigger.next();

          $(function () {
            $('data').DataTable();
          });
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });


  }

  getddlUOMs() {
    //confirm, unconfirm
    this.apiService.restApiGet("http://localhost:8080/share/ddlUOMs")
      .subscribe(
        data => {
          // console.log(data)
          this.ddlUOMs = data['data'];
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  getddlRAWs() {
    //confirm, unconfirm
    this.apiService.restApiGet("http://localhost:8080/share/ddlRAWs")
      .subscribe(
        data => {
          // console.log(data)
          this.ddlRAWs = data['data'];
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  onNewProduct() {
    this.Stock_ID = "";
    this.doc_no = "";
    this.doc_date = null;
    this.remark = "";
    this.chkDraft = 1;
    this.items = [];
    this.newItemStock = {};

  }

  ConverBooltoInt(data: boolean) {
    if (data == true) {
      return 1
    } else {
      return 0
    }
  }

  ConverInttoBool(data: Number) {
    if (data == 1) {
      return true
    } else {
      return false
    }
  }

  SaveStock() {
    console.log(this.Stock_ID)
    if (this.Stock_ID == "") { //Add Stock
      console.log("Save Stock")
      // this.doc_date = gettoday
      var date = new Date();
      this.doc_date = { day: date.getUTCDay(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear() };
      var dateuse = '0' + this.doc_date.day
      var monthuse = '0' + this.doc_date.month

      let json = {
        doc_date: this.doc_date.year.toString().slice(-2) + monthuse.slice(-2) + dateuse.slice(-2)
        // doc_date: "220201"
      }
      console.log(JSON.stringify(json))

      // this.apiService.restApiSendParm("http://localhost:8080/stock/genDocNo", JSON.stringify(json))
      //   .subscribe(
      //     response => {
      //       if (response) {
      //         let json = {
      //           doc_no: response['data'][0].new_docno,
      //           doc_date: this.doc_date.year.toString() + '-' + monthuse.slice(-2) + '-' + dateuse.slice(-2),
      //           //doc_date: "2021-02-01",
      //           type: 3,
      //           remarks: this.remark,
      //           draft: this.ConverBooltoInt(this.chkDraft),
      //           filename: "",
      //           user: 9,
      //         }
      //         //console.log(JSON.stringify(json))
      //         this.apiService.restApiSendParm("http://localhost:8080/stock/addStock", JSON.stringify(json))
      //           .subscribe(
      //             response => {
      //               if (response) {
      //                 this.DeleteStockLine(response['data'][0].stock_header_id);

      //                 Swal.fire('เพิ่มข้อมูลนำออกวัตถุดิบเรียบร้อยแล้ว', '', 'success');
      //                 // this.getProducts();
      //               } else {
      //                 // console.log("Login Fail")
      //                 Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลนำออกวัตถุดิบได้', 'error');
      //               }
      //             },
      //             error => {
      //               // console.log(error)
      //               Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลนำออกวัตถุดิบได้', 'error');
      //             });


      //       } else {
      //         // console.log("Login Fail")
      //         Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลนำออกวัตถุดิบได้', 'error');
      //       }
      //     },
      //     error => {
      //       // console.log(error)
      //       Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลนำออกวัตถุดิบได้', 'error');
      //     });
    } else {
      console.log("Update Stock")
      // console.log(this.Bundle_ID)
      var dateuse = '0' + this.doc_date.day
      var monthuse = '0' + this.doc_date.month
      let json = {
        id: this.Stock_ID,
        doc_no: this.doc_no,
        doc_date: this.doc_date.year.toString().slice(-2) + monthuse.slice(-2) + dateuse.slice(-2),
        type: 3,
        remarks: this.remark,
        draft: this.ConverBooltoInt(this.chkDraft),
        filename: "",
        user: 9,
      }
      console.log(JSON.stringify(json))

      this.apiService.restApiSendParm("http://localhost:8080/stock/updateStock", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              console.log("updateStock Complete")
              this.DeleteStockLine(this.Stock_ID);

              Swal.fire('แก้ไขข้อมูลนำออกวัตถุดิบเรียบร้อยแล้ว', '', 'success');
              // this.getProducts();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลนำออกวัตถุดิบได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลนำออกวัตถุดิบได้', 'error');
          });
      this.modalRef.hide();
    }
  }

  DeleteStockLine(stock_header_id: string) {
    console.log(stock_header_id)
    console.log("Delete StockLine")
    let json = {
      id: parseInt(stock_header_id)
    }

    console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/stock/deleteStockLine", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {
            this.AddStockLine(stock_header_id)
            // this.getProducts();
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'ไม่สามารถลบข้อมูลได้', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'ไม่สามารถลบข้อมูลได้', 'error');
        });
  }

  AddStockLine(stock_header_id: string) {
    console.log(stock_header_id)
    console.log("Add Stock Line")
    for (let i = 0; i < this.items.length; i++) {
      // console.log("Loop :" + i)
      let json = {
        stock_header_id: parseInt(stock_header_id),
        raw_material_id: parseInt(this.items[i].raw_material_id),
        barcode: this.items[i].barcode,
        uom_id: parseInt(this.items[i].uom_id),
        quantity: parseFloat(this.items[i].quantity),
        price: parseFloat(this.items[i].price),
      }

      console.log(JSON.stringify(json))
      this.apiService.restApiSendParm("http://localhost:8080/stock/addStockLine", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              // this.getProducts();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลนำออกวัตถุดิบได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลนำออกวัตถุดิบได้', 'error');
          });
    }
  }

  DeleteStock() {
    console.log("Delete Stock")
    let json = { id: parseInt(this.Stock_ID) }
    // console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/stock/deleteStock", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {

            this.DeleteStockLine(this.Stock_ID);
            Swal.fire('ลบข้อมูลการนำออกวัตถุดิบเรียบร้อยแล้ว', '', 'success');
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'ไม่สามารถลบข้อมูลการนำออกวัตถุดิบได้', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'ไม่สามารถลบข้อมูลการนำออกวัตถุดิบได้', 'error');
        });

    this.modalRef.hide();
  }

  getStockLines() {
    console.log("View Stock Lines")

    let json = {
      id: parseInt(this.Stock_ID)
    }
    console.log(JSON.stringify(json))

    this.apiService.restApiSendParm("http://localhost:8080/stock/getStockLine", JSON.stringify(json))
      .subscribe(
        data => {
          this.items = data['data'];

          $(function () {
            $('data').DataTable({
              // paging: false,
              // searching: false
            });
          });

          this.dtTrigger.next();
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });

    // this.ngOnDestroy();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });
  }

  editModal(template: TemplateRef<any>, stock) {
    this.Stock_ID = stock.id
    this.doc_no = stock.doc_no
    // this.doc_date = stock.doc_date
    const dateUse = stock.doc_date.split('/');
    this.doc_date = { day: parseInt(dateUse[0], 10), month: parseInt(dateUse[1], 10), year: parseInt(dateUse[2], 10) };
    console.log(this.doc_date)

    this.remark = stock.remarks
    this.chkDraft = stock.draft

    this.getStockLines();

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });

  }

  viewLineModal(template: TemplateRef<any>, stock) {
    this.Stock_ID = stock.id
    this.linecount = stock.record
    this.getStockLines();

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });

  }

  deleteModal(template: TemplateRef<any>, product) {
    this.Product_ID = product.id;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }


  decline() {
    this.modalRef.hide();
  }

  addItems() {
    this.newItemStock.raw_material_id = this.item_raw_id;
    this.newItemStock.raw_material_name = this.item_raw_name;
    this.newItemStock.uom_id = this.item_uom_id;
    this.newItemStock.uom_name = this.item_uom_name;
    this.items.push(this.newItemStock);
    console.log(this.items);
    this.newItemStock = {};
  }

  removeItem(index) {
    this.items.splice(index, 1); // remove 1 item at ith place
  }

  onChange(raw) {
    // console.log(deviceValue)
    if (raw != "") {
      for (let i = 0; i < this.ddlRAWs.length; i++) {
        if (raw == this.ddlRAWs[i].raw_id) {
          this.item_raw_name = this.ddlRAWs[i].raw_name
          this.item_raw_id = this.ddlRAWs[i].raw_id
        }
      }
    }
    // this.item_raw_name = deviceValue[0].raw_name;
  }

  onChangeUOM(uom) {
    // console.log(deviceValue)
    if (uom != "") {
      for (let i = 0; i < this.ddlUOMs.length; i++) {
        if (uom == this.ddlUOMs[i].uom_id) {
          this.item_uom_name = this.ddlUOMs[i].uom_name
          this.item_uom_id = this.ddlUOMs[i].uom_id
        }
      }
    }
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // this.addItems()
      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      // console.log("data:", this.data);

      this.items = [];
      this.newItemStock = {};

      for (var index in this.data) {
        if (index != "0") {
          if (this.data[index][1] != "") {
            this.newItemStock.barcode = this.data[index][0]
            this.newItemStock.productname = this.data[index][1]
            this.newItemStock.quantity = this.data[index][7]
            this.newItemStock.price = this.data[index][5]
            this.newItemStock.total_price = this.data[index][11]
            this.items.push(this.newItemStock);
            // console.log(this.items);
            this.newItemStock = {};

          }



        }
        this.linecount = index;
        // console.log(index); // prints indexes: 0, 1, 2, 3

        // console.log(this.data[index]); // prints elements: 10, 20, 30, 40
      }

      // this.data.map(res => {
      //   if (res[0] === "no") {
      //     console.log(res[0]);
      //   } else {
      //     console.log(res[0]);
      //   }
      // })
    };
    reader.readAsBinaryString(target.files[0]);
  }

  btnColor() {
    document.getElementById('btn-yes').style.backgroundColor = '#00d0f1';
    document.getElementById('btn-yes').style.border = '1px solid #00d0f1';
    document.getElementById('btn-yes').style.color = '#fff';

    document.getElementById('btn-no').style.backgroundColor = '#fff';
    document.getElementById('btn-no').style.border = '1px solid #fff';
    document.getElementById('btn-no').style.color = '#000';
  }

  btnColorNo() {
    document.getElementById('btn-no').style.backgroundColor = '#00d0f1';
    document.getElementById('btn-no').style.border = '1px solid #00d0f1';
    document.getElementById('btn-no').style.color = '#fff';

    document.getElementById('btn-yes').style.backgroundColor = '#fff';
    document.getElementById('btn-yes').style.border = '1px solid #fff';
    document.getElementById('btn-yes').style.color = '#000';
  }



}