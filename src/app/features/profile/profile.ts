import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({selector:'app-profile',standalone:true,imports:[CommonModule,ReactiveFormsModule],templateUrl:'./profile.html'})
export class ProfileComponent implements OnInit {
  private http=inject(HttpClient);private fb=inject(FormBuilder);form=this.fb.nonNullable.group({id:'',username:'',fullName:['',Validators.required],email:[''],phoneNumber:[''],role:'',isActive:true});message='';error='';
  ngOnInit(){this.http.get<any>(`${environment.apiUrl}/profile`).subscribe({next:u=>this.form.patchValue(u),error:e=>this.error=e?.error?.message||'Profile load failed.'});}
  save(){if(this.form.invalid){this.form.markAllAsTouched();return;}this.http.put(`${environment.apiUrl}/profile`,this.form.getRawValue()).subscribe({next:()=>this.message='Profile updated successfully.',error:e=>this.error=e?.error?.message||'Update failed.'});}
}
