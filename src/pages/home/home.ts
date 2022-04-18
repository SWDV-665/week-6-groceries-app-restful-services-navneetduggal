import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GroceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { InputDialogServiceProvider } from '../../providers/input-dialog-service/input-dialog-service';
import {SocialSharing} from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title = "Grocery";
  items = [];
  errorMessage: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, 
    public alertCtrl: AlertController, public dataService: GroceriesServiceProvider, 
    public inputDialogService: InputDialogServiceProvider,
    public socialSharing: SocialSharing) {
      dataService.dataChanged$.subscribe((dataChanged: Boolean) =>{
        this.loadItems();
      });
  }

  ionViewDidLoad(){
    this.loadItems();
  }

  loadItems() {
    return this.dataService.getItems().subscribe(
      items => this.items = items,
      error => this.errorMessage = <any>error);
  
  }

  removeItem(item, index) {
    console.log("Removing Item - ", item, index);
    const toast = this.toastCtrl.create({
      message: 'Removing Item - ' + index + " ...",
      duration: 3000
    });
    toast.present();

    this.dataService.removeItem(item._id);  
  }

  shareItem(item, index) {
    console.log("Sharing Item - ", item, index);
    const toast = this.toastCtrl.create({
      message: 'Sharing Item - ' + index + " ...",
      duration: 3000
    });
    toast.present();
    let message = "Grocery Item - Name: " + item.name + "- Quantity: " + item.quantity;
    let subject = "Shared via Groceries app";
    this.socialSharing.share(message,subject).then(()=>{
      console.log("Shared");
    }).catch((error)=>{
      console.log(error);
    });
  }

  editItem(item, index) {
    console.log("Edit Item - ", item, index);
    const toast = this.toastCtrl.create({
      message: 'Editing Item - ' + index + " ...",
      duration: 3000
    });
    toast.present();
    this.inputDialogService.showPrompt(item, item._id);
  }  

  addItem() {
    console.log("Adding Item");
    this.inputDialogService.showPrompt();
  }



}
