import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
export interface SkillItem{id:number , name:string;}
@Injectable({ providedIn: 'root' })

export class SkillsService{
    constructor (private http:HttpClient){}
    loadSkills(): Observable<SkillItem[]>{
         return this.loadSkills.arguments();
    }
}




