import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShopService } from '../../core/services/shop.service';
import { Product, Category, Brand, Size, Color, AgeGroup, UserSummary, Payment, PaymentStatus, Supplier } from '../../core/models/shop.model';

@Component({selector:'app-admin',standalone:true,imports:[CommonModule,ReactiveFormsModule,DecimalPipe],templateUrl:'./admin.html'})
export class AdminComponent implements OnInit {
  api=inject(ShopService);private fb=inject(FormBuilder);
  tab='dashboard'; dashboard:any; products:Product[]=[]; categories:Category[]=[];brands:Brand[]=[];sizes:Size[]=[];colors:Color[]=[];ages:AgeGroup[]=[];users:UserSummary[]=[];payments:Payment[]=[];suppliers:Supplier[]=[];
  error='';message='';editingProduct?:Product;

  productForm=this.fb.group({productName:['',Validators.required],sku:['',Validators.required],description:[''],categoryId:['',Validators.required],brandId:[''],gender:[0],ageGroupId:[''],fabric:[''],season:[''],purchasePrice:[0,[Validators.required,Validators.min(0)]],salePrice:[0,[Validators.required,Validators.min(0)]],discount:[0,Validators.min(0)],minimumStockLevel:[0,Validators.min(0)],isActive:[true],imageUrls:this.fb.array<string>([]),variants:this.fb.array<any>([])});
  masterForm=this.fb.nonNullable.group({name:['',Validators.required],description:[''],ageRange:[''],hexCode:[''],minAgeMonths:[0],maxAgeMonths:[0],isActive:true});
  supplierForm=this.fb.nonNullable.group({name:['',Validators.required],phone:[''],email:[''],address:[''],isActive:true});
  purchaseForm=this.fb.nonNullable.group({supplierId:['',Validators.required],invoiceNumber:[''],purchaseDate:[new Date().toISOString().slice(0,10),Validators.required],paymentStatus:[0],notes:[''],productVariantId:['',Validators.required],quantity:[1,[Validators.required,Validators.min(1)]],purchasePrice:[0,[Validators.required,Validators.min(0)]]});

  get variants(){return this.productForm.controls.variants as FormArray;}
  get imageUrls(){return this.productForm.controls.imageUrls as FormArray;}
  ngOnInit(){this.loadAll();}
  loadAll(){this.api.adminDashboard().subscribe(x=>this.dashboard=x);this.api.products().subscribe(x=>this.products=x);this.api.categories().subscribe(x=>this.categories=x);this.api.brands().subscribe(x=>this.brands=x);this.api.sizes().subscribe(x=>this.sizes=x);this.api.colors().subscribe(x=>this.colors=x);this.api.ageGroups().subscribe(x=>this.ages=x);this.api.adminUsers().subscribe(x=>this.users=x);this.api.payments().subscribe(x=>this.payments=x);this.api.suppliers().subscribe(x=>this.suppliers=x);}
  setTab(t:string){this.tab=t;this.message='';this.error='';}
  editProduct(p:Product){this.editingProduct=p;this.productForm.patchValue({productName:p.productName,sku:p.sku,description:p.description??'',categoryId:p.categoryId,brandId:p.brandId??'',gender:p.gender,ageGroupId:p.ageGroupId??'',fabric:p.fabric??'',season:p.season??'',purchasePrice:p.purchasePrice,salePrice:p.salePrice,discount:p.discount,minimumStockLevel:p.minimumStockLevel,isActive:p.isActive});this.imageUrls.clear();p.images.forEach(x=>this.imageUrls.push(this.fb.control(x)));this.variants.clear();p.variants.forEach(v=>this.addVariant(v));}
  newProduct(){this.editingProduct=undefined;this.productForm.reset({gender:0,isActive:true,purchasePrice:0,salePrice:0,discount:0,minimumStockLevel:0,categoryId:'',brandId:'',ageGroupId:''});this.imageUrls.clear();this.variants.clear();}
  addImage(){this.imageUrls.push(this.fb.control(''))}
  addVariant(v?:any){this.variants.push(this.fb.group({sizeId:[v?.sizeId??'',Validators.required],colorId:[v?.colorId??'',Validators.required],sku:[v?.sku??'',Validators.required],purchasePrice:[v?.purchasePrice??0,Validators.min(0)],salePrice:[v?.salePrice??0,Validators.min(0)],stockQuantity:[v?.stockQuantity??0,Validators.min(0)],minimumStockLevel:[v?.minimumStockLevel??0,Validators.min(0)],isActive:[v?.isActive??true]}));}
  removeVariant(i:number){this.variants.removeAt(i)} removeImage(i:number){this.imageUrls.removeAt(i)}
  saveProduct(){if(this.productForm.invalid){this.productForm.markAllAsTouched();return;}const v=this.productForm.getRawValue();this.api.saveProduct(v,this.editingProduct?.id).subscribe({next:()=>{this.message='Product saved successfully.';this.loadAll();this.newProduct();},error:(e: any)=>this.error=e?.error?.message||'Product save failed.'});}
  deleteProduct(p:Product){if(!confirm(`Deactivate ${p.productName}?`))return;this.api.deleteProduct(p.id).subscribe(()=>this.loadAll());}
  saveMaster(type:string){if(this.masterForm.invalid)return;const v=this.masterForm.getRawValue();let req:any;
    if(type==='category')req=this.api.saveCategory({name:v.name,description:v.description,isActive:v.isActive});
    if(type==='brand')req=this.api.saveBrand({name:v.name,isActive:v.isActive});
    if(type==='size')req=this.api.saveSize({name:v.name,ageRange:v.ageRange,isActive:v.isActive});
    if(type==='color')req=this.api.saveColor({name:v.name,hexCode:v.hexCode,isActive:v.isActive});
    if(type==='age')req=this.api.saveAgeGroup({name:v.name,minAgeMonths:v.minAgeMonths,maxAgeMonths:v.maxAgeMonths,isActive:v.isActive});
    req.subscribe({next:()=>{this.message=`${type} added successfully.`;this.masterForm.reset({name:'',description:'',ageRange:'',hexCode:'',minAgeMonths:0,maxAgeMonths:0,isActive:true});this.loadAll();},error:(e: any)=>this.error=e?.error?.message||'Save failed.'});
  }
  toggleUser(u:UserSummary){this.api.setUserActive(u.id,!u.isActive).subscribe(()=>{u.isActive=!u.isActive;});}
  updatePayment(p:Payment,e:Event){const status=Number((e.target as HTMLSelectElement).value);this.api.updatePaymentStatus(p.id,status).subscribe(()=>this.loadAll());}
  saveSupplier(){if(this.supplierForm.invalid)return;this.api.saveSupplier(this.supplierForm.getRawValue()).subscribe({next:()=>{this.message='Supplier saved.';this.supplierForm.reset({name:'',phone:'',email:'',address:'',isActive:true});this.loadAll();},error:(e: any)=>this.error=e?.error?.message||'Supplier save failed.'});}
  createPurchase(){if(this.purchaseForm.invalid)return;const v=this.purchaseForm.getRawValue();this.api.createPurchase({supplierId:v.supplierId,invoiceNumber:v.invoiceNumber||undefined,purchaseDate:v.purchaseDate,paymentStatus:v.paymentStatus,notes:v.notes,items:[{productVariantId:v.productVariantId,quantity:v.quantity,purchasePrice:v.purchasePrice}]}).subscribe({next:()=>{this.message='Purchase created and stock increased.';this.loadAll();},error:(e: any)=>this.error=e?.error?.message||'Purchase failed.'});}
}
