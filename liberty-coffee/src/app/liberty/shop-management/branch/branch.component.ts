import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'rxjs/add/operator/map';
import { TextMaskModule } from 'angular2-text-mask';
import { NgNumberFormatterModule } from 'ng-number-formatter';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {
  RoleId: any;
  dtOptions: DataTables.Settings = {};
  branchs = [];
  Branch_ID: any;
  Branch_Name: any;
  Address: any;
  Time_Open: any;
  Time_Close: any;
  chkActive: any;
  Active: boolean;
  Active_ID: any;
  public maskHour = [/\d/, /\d/, ':', /\d/, /\d/];

  dtOptionsUOMT: DataTables.Settings = {};
  uoms = [];
  uomts = [];
  modalRef: BsModalRef;
  dtTrigger: Subject<any> = new Subject<any>();
  UOM_ID;
  UOM_Name;
  UOM_Active: boolean;
  UOM_Active_ID: any;
  ddlUOMs: any[];
  UOMT_ID;
  UOMID_1;
  UOMID_2;
  Quantity_1;
  Quantity_2;
  private myEventSubscription: any;
  private myEventSubscription1: any;
  strRoleId: string;
  strUserID: string;
  strBranchId: string;



  constructor(private http: HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService,
    private textMask: TextMaskModule,
    private NgNumber: NgNumberFormatterModule
  ) { }

  ngOnInit() {
    var userid = localStorage.getItem('userid')
    var branchid = localStorage.getItem('branchid')
    var roleid = localStorage.getItem('roleid');

    this.strUserID = userid
    this.strBranchId = branchid
    this.RoleId = roleid

    this.getBranchs()
  }

  getBranchs() {
    this.myEventSubscription = this.apiService.restApiGet("http://localhost:8080/shop/getBranch")
      .subscribe(
        data => {
          if (this.RoleId == "1") {
            //this.uoms = (data as any).data ;
            this.branchs = data['data'];
            // console.log(this.uoms)
            this.dtTrigger.next();

            $(function () {
              $('data').DataTable();
            });
          } else if (this.RoleId == "2") {
            this.branchs = data['data'];

            console.log(this.RoleId)
            this.branchs = this.branchs.filter(data => data.id === this.strBranchId)
            console.log(this.branchs)
            if (this.branchs.length > 0) {
              this.Branch_ID = this.branchs[0].id
              this.Branch_Name = this.branchs[0].name
              this.Address = this.branchs[0].address1
              this.Time_Open = this.branchs[0].open_time
              this.Time_Close = this.branchs[0].close_time
              this.UOM_Active = this.ConverInttoBool(this.branchs[0].active)
              this.UOM_Active_ID = this.branchs[0].active
              // this.newItemStock.barcode = this.data[index][0]
              // this.newItemStock.productId = this.BundleProductMap[0].id
              // this.newItemStock.productname = this.data[index][1]
              // this.newItemStock.quantity = this.data[index][7]
              // this.newItemStock.price = this.data[index][5]
              // this.newItemStock.total_price = this.data[index][11]
              // this.newItemStock.uom_id = this.BundleProductMap[0].uom_id
              // this.items.push(this.newItemStock);
              // this.newItemStock = {};
            }
          }



          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });


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

  onNewBranch() {
    this.Branch_ID = "";
    this.Branch_Name = "";
    this.Address = "";
    this.Time_Open = "";
    this.Time_Close = "";
    this.UOM_Active = true;
  }

  SaveBranch() {
    console.log("Save Branch")
    if (this.Branch_ID == "" || this.Branch_ID == undefined) {
      let json = {
        name: this.Branch_Name,
        address1: this.Address,
        open_time: this.Time_Open,
        close_time: this.Time_Close,
        active: this.ConverBooltoInt(this.UOM_Active),
        user: parseInt(this.strUserID),
      }
      // console.log(JSON.stringify(json))
      this.apiService.restApiSendParm("http://localhost:8080/shop/addBranch", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('เพิ่มข้อมูลสาขาเรียบร้อยแล้ว', '', 'success');
              // this.getUOMs();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลสาขาได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลสาขาได้', 'error');
          });
    } else {
      let json = {
        id: parseInt(this.Branch_ID),
        name: this.Branch_Name,
        address1: this.Address,
        open_time: this.Time_Open,
        close_time: this.Time_Close,
        active: this.ConverBooltoInt(this.UOM_Active),
        user: parseInt(this.strUserID),
      }
      // console.log(JSON.stringify(json))
      this.apiService.restApiSendParm("http://localhost:8080/shop/updateBranch", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('แก้ไขข้อมูลสาขาเรียบร้อยแล้ว', '', 'success');
              // this.getUOMs();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลสาขาได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลสาขาได้', 'error');
          });
    }

  }

  UpdateUOM() {
    console.log("Update UOM")
    let json = {
      id: parseInt(this.UOM_ID),
      name: this.UOM_Name,
      active: this.ConverBooltoInt(this.UOM_Active),
      user: "system",
    }
    // console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/uom/updateUOM", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {
            Swal.fire('แก้ไขข้อมูลหน่วยนับเรียบร้อยแล้ว', '', 'success');
            this.getBranchs();
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลหน่วยนับได้', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลหน่วยนับได้', 'error');
        });
  }

  DeleteUOM() {
    console.log("Delete UOM")
    let json = { id: parseInt(this.UOM_ID) }
    this.modalRef.hide();
    // console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/uom/deleteUOM", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {
            Swal.fire('ลบข้อมูลหน่วยนับเรียบร้อยแล้ว', '', 'success');
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'ไม่สามารถลบข้อมูลหน่วยนับได้', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'ไม่สามารถลบข้อมูลหน่วยนับได้', 'error');
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

  SaveUOMT() {
    // console.log(this.UOM_Name)
    console.log(this.UOMT_ID)
    if (this.UOMT_ID === "") {
      console.log("Save UOMT")
      // console.log(this.UOMT_ID)
      let json = {
        uom_id1: parseInt(this.UOMID_1),
        quantity1: parseFloat(this.Quantity_1),
        uom_id2: parseInt(this.UOMID_2),
        quantity2: parseFloat(this.Quantity_2),
        active: 1,
        user: 9,
      }
      // console.log(JSON.stringify(json))


      this.apiService.restApiSendParm("http://localhost:8080/uom/addUOMT", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('เพิ่มข้อมูลแปลงหน่วยนับเรียบร้อยแล้ว', '', 'success');
              // this.getUOMs();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลแปลงหน่วยนับได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลแปลงหน่วยนับได้', 'error');
          });
      this.modalRef.hide();
    } else {
      console.log("Update UOMT")
      // console.log(this.UOMT_ID)
      let json = {
        id: parseInt(this.UOMT_ID),
        uom_id1: parseInt(this.UOMID_1),
        quantity1: parseFloat(this.Quantity_1),
        uom_id2: parseInt(this.UOMID_2),
        quantity2: parseFloat(this.Quantity_2),
        active: 1,
        user: 9,
      }
      // console.log(JSON.stringify(json))


      this.apiService.restApiSendParm("http://localhost:8080/uom/updateUOMT", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('แก้ไขข้อมูลแปลงหน่วยนับเรียบร้อยแล้ว', '', 'success');
              // this.getUOMs();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลแปลงหน่วยนับได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลแปลงหน่วยนับได้', 'error');
          });
      this.modalRef.hide();
    }

  }

  getUOMTs() {
    console.log("View UOMT")


    let json = {
      id: parseInt(this.UOM_ID)
    }

    this.myEventSubscription1 = this.apiService.restApiSendParm("http://localhost:8080/uom/getUOMTs", JSON.stringify(json))
      .subscribe(
        data => {
          this.uomts = data['data'];


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

  DeleteUOMT() {
    console.log("Delete UOMT")
    let json = { id: parseInt(this.UOMT_ID) }
    this.modalRef.hide();
    // console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/uom/deleteUOMT", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {
            Swal.fire('ลบข้อมูลแปลงหน่วยนับเรียบร้อยแล้ว', '', 'success');
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'ไม่สามารถลบข้อมูลแปลงหน่วยนับได้', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'ไม่สามารถลบข้อมูลแปลงหน่วยนับได้', 'error');
        });
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });
  }

  editModal(template: TemplateRef<any>, branch) {
    this.Branch_ID = branch.id;
    this.Branch_Name = branch.name;
    this.Address = branch.address1;
    this.Time_Open = branch.open_time;
    this.Time_Close = branch.close_time;
    this.chkActive = branch.active
    this.Active = branch.active

    this.UOM_Active = this.ConverInttoBool(branch.active)
    this.UOM_Active_ID = branch.active

    console.log(branch.active)


    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });

  }

  addUOMTModal(template: TemplateRef<any>) {
    this.UOMT_ID = "";
    this.Quantity_1 = "";
    this.UOMID_2 = "";
    this.Quantity_2 = "";

    this.modalRef = this.modalService.show(template);

  }

  viewUOMTModal(template: TemplateRef<any>, uom) {
    this.UOM_ID = uom.id;
    this.UOM_Name = uom.name;
    this.getUOMTs()

    this.getddlUOMs()
    this.UOMID_1 = this.UOM_ID;
    console.log(this.UOM_ID)
    console.log(this.UOMID_1)

    this.modalRef = this.modalService.show(template);

  }

  editUOMTModal(template: TemplateRef<any>, uomts) {
    //this.getddlUOMs()   \    
    this.UOMT_ID = uomts.id;
    this.UOMID_1 = uomts.uom_id1;
    this.Quantity_1 = uomts.quantity1;
    this.UOMID_2 = uomts.uom_id2;
    this.Quantity_2 = uomts.quantity2;

    this.modalRef = this.modalService.show(template);

  }

  deleteModal(template: TemplateRef<any>, uom) {
    this.UOM_ID = uom.id;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

  deleteModal1(template: TemplateRef<any>, uomt) {
    this.UOMT_ID = uomt.id;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

  decline() {
    this.modalRef.hide();
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


