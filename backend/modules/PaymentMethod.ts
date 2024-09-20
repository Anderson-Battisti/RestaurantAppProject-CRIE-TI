export class PaymentMethod
{
    name : string = "";
    method : string = ""; // card, transference, etc
    type : string = ""; //credit, debit, pix, etc


    validRequisition()
    {
        if (this.name != null && this.name != undefined && this.name != "" &&
            this.method != null && this.method != undefined && this.method != "" &&
            this.type != null && this.type != undefined && this.type != "")
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}

