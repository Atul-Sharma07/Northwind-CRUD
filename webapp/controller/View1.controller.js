sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
],
function (Controller, MessageBox, Fragment) {
    "use strict";

    return Controller.extend("task1.task1.controller.View1", {
        
        onInit: function () {
            var odataModel = new sap.ui.model.odata.v2.ODataModel("/V2/(S(ylr22qecjsmeush5aiffi4rl))/OData/OData.svc")
            let arr=[];
            console.log(typeof arr);
            odataModel.read("/Products", {
                success: function (oData, oResponse) {
                    oData.results.forEach(Element=>{
                        arr.push(Element.ID);
                    });
                    MessageBox.success("Success");
                },
                error: function (oError) {
                    MessageBox.error("Error");
                }
            });
            this.allId=arr;
            this.getView().setModel(odataModel);
            this.getView().getModel().setUseBatch(false);
        },
        onUpdate: function (oEvent) {
            var oView        = this.getView();
            var editDialog   = this.byId("productDialog");
            var oContext     = oEvent.getSource().getBindingContext();
            this.updateEvent = oEvent;

            if (!editDialog) {
                Fragment.load({
                    id         : oView.getId(),
                    name       : "task1.task1.fragment.editProduct",
                    controller : this
                }).then(function (editDialog) {
                    oView.addDependent(editDialog);
                    editDialog.bindElement(oContext.getPath());
                    this.changeFragmentDate();
                    editDialog.open();
                }.bind(this));
            } else {
                editDialog.bindElement(oContext.getPath());
                this.changeFragmentDate();
                editDialog.open();
            }
        },
        changeFragmentDate: function () {

            var release = this.byId("releaseDateId").getValue();
            var newDate = new Date(release);
            var date    = newDate.getDate();
            var Month   = newDate.getMonth() + 1;
            var Year    = newDate.getFullYear();

            this.byId("releaseDateId").setValue(`${date}/${Month}/${Year}`);

            var disContinued = this.byId("discontinuedDateId").getValue();
            newDate = new Date(disContinued);
            date    = newDate.getDate();
            Month   = newDate.getMonth() + 1;
            Year    = newDate.getFullYear();
            if (isNaN(date)) {
                this.byId("discontinuedDateId").setValue(null);
            }
            else {
                this.byId("discontinuedDateId").setValue(`${date}/${Month}/${Year}`);
            }
        },
        onSave: function () {
            var oEvent     = this.updateEvent;
            var sPath      = oEvent.getSource().getBindingContext().getPath();
            var odataModel = this.getView().getModel();

            var updatedDate    = this.byId("releaseDateId").getValue();
            var parts          = updatedDate.split("/");
            var dateObject     = new Date(parts[2], parts[1] - 1, parts[0]);
            var timestamp      = dateObject.getTime();
            var newReleaseDate = `/Date(${timestamp})/`;

            var updatedDate         = this.byId("discontinuedDateId").getValue();
            var parts               = updatedDate.split("/");
            var dateObject          = new Date(parts[2], parts[1] - 1, parts[0]);
            var timestamp           = dateObject.getTime();
            var newDiscontinuedDate = `/Date(${timestamp})/`;

            var newDetails = {
                Name             : this.byId("nameId").getValue(),
                Description      : this.byId("descriptionId").getValue(),
                ReleaseDate      : newReleaseDate,
                DiscontinuedDate : isNaN(timestamp) ? null : newDiscontinuedDate,
                Rating           : Number(this.byId("ratingId").getValue()),
                Price            : this.byId("priceId").getValue()
            };
            odataModel.update(sPath, newDetails, {
                success: function (data, response) {
                    MessageBox.success("Updated Successfully!");
                },
                error: function (error) {
                    MessageBox.error("Some Error Occure");
                }
            });
            this.byId("productDialog").close();
        },
        onCancel: function () {
            this.byId("productDialog").close();
        },
        onCreate: function () {

            var oView = this.getView();

            if (!this.createDialog) {
                Fragment.load({
                    id         : oView.getId(),
                    name       : "task1.task1.fragment.createProduct",
                    controller : this
                }).then(function (createDialog) {
                    this.createDialog = createDialog;
                    oView.addDependent(this.createDialog);
                    // this.clearDialog();
                    this.createDialog.open();
                }.bind(this));
            } else {
                // this.clearDialog();
                this.createDialog.open();
            }
        },
        clearDialog: function () {
            this.byId("createId").setValue();
            this.byId("crateNameId").setValue();
            this.byId("createDescriptionId").setValue();
            this.byId("createReleaseDateId").setValue();
            this.byId("createDiscontinuedDateId").setValue();
            this.byId("createRationgId").setValue();
            this.byId("createPriceId").setValue();
        },
        saveCreate: function () {
            var odataModel = this.getView().getModel();

            var updatedDate    = this.byId("createReleaseDateId").getValue();
            var parts          = updatedDate.split("/");
            var dateObject     = new Date(parts[2], parts[1] - 1, parts[0]);
            var timestamp      = dateObject.getTime();
            var newReleaseDate = `/Date(${timestamp})/`;

            var updatedDate         = this.byId("createDiscontinuedDateId").getValue();
            var parts               = updatedDate.split("/");
            var dateObject          = new Date(parts[2], parts[1] - 1, parts[0]);
            var timestamp           = dateObject.getTime();
            var newDiscontinuedDate = `/Date(${timestamp})/`;

            var newDetails = {
                ID               : Number(this.byId("createId").getValue()),
                Name             : this.byId("createNameId").getValue(),
                Description      : this.byId("createDescriptionId").getValue(),
                ReleaseDate      : newReleaseDate,
                DiscontinuedDate : isNaN(timestamp) ? null : newDiscontinuedDate,
                Rating           : Number(this.byId("createRatingId").getValue()),
                Price            : this.byId("createPriceId").getValue()
            };
            
            if (newDetails.ID || newDetails.ID === 0) {
                console.log("IDs : ",this.allId);
                if(this.allId.includes(newDetails.ID)){
                    MessageBox.error("ID exist");
                }
                else
                {
                    odataModel.create("/Products", newDetails, {
                        success: function (data, response) {
                            MessageBox.success("Updated Successfully!");
                        },
                        error: function (error) {
                            MessageBox.error("Some Error Occure");
                        }
                    });
                    this.allId.push(newDetails.ID);
                }
            }
            else {
                MessageBox.error("ID not given");
            }
            this.createDialog.close();
        },

        cancleCreate: function () {
            this.createDialog.close();
        },
        onDelete: function (oEvent) {
            var sPath      = oEvent.getSource().getBindingContext().getPath();
            var odataModel = this.getView().getModel();

            
            // var productIds=this.allId;
            // var that=this;
            // console.log("before delete : ",this.allId);
            odataModel.remove(sPath, {
                success: function (data, response) {
                    // var removedId=sPath.match(/\d+/);
                    // var idx=productIds.indexOf(removedId);
                    // if (idx > -1) {
                    //     console.log("we are inside if");
                    //     productIds.splice(idx, 1); 
                    // }
                    MessageBox.success("Deleted Successfully");
                    // that.allId=productIds;
                    // console.log("ProductIDs : ",productIds);
                },
                error: function (error) {
                    MessageBox.error("Some Error occure");
                }
            });
            odataModel.refresh();
            // console.log("before delete : ",this.allId);
        }
    });
});
