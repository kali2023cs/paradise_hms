<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MasterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CheckinController;
use App\Http\Controllers\RoommenuController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\NonRevenueController;
use App\Http\Controllers\PropertyController;


// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware(['auth:sanctum', \App\Http\Middleware\SetTenantDatabase::class])->group(function () {

// BlockMaster routes
    Route::get('/blockmaster', [MasterController::class, 'blockmaster']);
    Route::post('/addblockmaster', [MasterController::class, 'addblockmaster']);
    Route::put('/blockmaster/{id}', [MasterController::class, 'editblockmaster']);
    Route::delete('/blockmaster/{id}', [MasterController::class, 'deleteBlockMaster']);

    // Route::get('/guestmaster', [MasterController::class, 'guestmaster']);
    // Route::get('/titlemaster', [MasterController::class, 'titlemaster']);
    // Route::get('/idmaster', [MasterController::class, 'idmaster']);
    // Route::post('/addguestmaster', [MasterController::class, 'addguestmaster']);
    // Route::put('/editguestmaster/{id}', [MasterController::class, 'editguestmaster']);
    // Route::delete('/guestmaster/{id}', [MasterController::class, 'deleteGuestMaster']);

    Route::get('/guestmaster', [MasterController::class, 'guestmaster']);
    Route::post('/guestmaster', [MasterController::class, 'addguestmaster']);
    Route::put('/guestmaster/{guest}', [MasterController::class, 'editguestmaster']);
    Route::delete('/guestmaster/{guest}', [MasterController::class, 'deleteGuestMaster']);
    Route::get('/idmaster', [MasterController::class, 'idmaster']);
    Route::get('/titlemaster', [MasterController::class, 'titlemaster']);


    Route::get('/getproperty/{id}', [PropertyController::class, 'getPropertyById']);
    Route::put('/updateproperty/{id}', [PropertyController::class, 'updateProperty']);


    // FloorMaster routes
    Route::get('/floormaster', [MasterController::class, 'floormaster']);
    Route::post('/floormaster', [MasterController::class, 'addfloormaster']);
    Route::put('/floormaster/{id}', [MasterController::class, 'editfloormaster']);
    Route::delete('/floormaster/{id}', [MasterController::class, 'deleteFloorMaster']);

    // RoomTypeMaster routes
    Route::get('/plans', [MasterController::class, 'getPlans']);
    Route::get('/roomtypemaster', [MasterController::class, 'roomtypemaster']);
    Route::post('/roomtypemaster', [MasterController::class, 'addroomtypemaster']);
    Route::put('/roomtypemaster/{id}', [MasterController::class, 'editroomtypemaster']);
    Route::delete('/roomtypemaster/{id}', [MasterController::class, 'deleteRoomTypeMaster']);
    
    // RoomStatusMaster routes
    Route::get('/roomstatusmaster', [MasterController::class, 'roomstatusmaster']);
    
    // RoomMaster routes
    Route::get('/roommaster', [MasterController::class, 'roommaster']);
    Route::post('/roommaster', [MasterController::class, 'addroommaster']);
    Route::put('/roommaster/{id}', [MasterController::class, 'editroommaster']);
    Route::delete('/roommaster/{id}', [MasterController::class, 'deleteroommaster']);

    Route::get('/retriveRoomMasterForBlock', [RoommenuController::class, 'retriveRoomMasterForBlock']);
    Route::post('/blockRoom', [RoommenuController::class, 'blockRoom']);
    Route::get('/retriveBlockedRooms', [RoommenuController::class, 'retriveBlockedRooms']);
    Route::post('/unblockRoom', [RoommenuController::class, 'unblockRoom']);

    // Checkout routes
    Route::post('/checkout', [CheckoutController::class, 'processCheckout']);
    Route::get('/checkout/{checkoutId}', [CheckoutController::class, 'getCheckoutDetails']);
    Route::get('/isCheckIned/{roomId}', [CheckoutController::class, 'isCheckIned']);
    Route::get('/checkout/list', [CheckoutController::class, 'getCheckoutList']);
    Route::post('/checkout/payments', [CheckoutController::class, 'recordPayment']);
    
    // Invoice routes
    Route::get('/invoices', [InvoiceController::class, 'getInvoiceList']);
    Route::get('/invoices/{invoiceNumber}', [InvoiceController::class, 'getInvoiceDetails']);
    Route::get('/invoices/generate-pdf/{invoiceNumber}', [InvoiceController::class, 'generatePdf']);

    Route::post('/generate-police-report', [NonRevenueController::class, 'generatePoliceReport']);
    Route::post('/generate-checkinout-report', [NonRevenueController::class, 'generateCheckInOutReport']);
    Route::post('/generate-rooms-report', [NonRevenueController::class, 'generateRoomsReport']);
    Route::post('/generate-occupancy-report', [NonRevenueController::class, 'generate']);
    Route::get('/blocks', [NonRevenueController::class, 'getBlocks']);
    Route::get('/floors', [NonRevenueController::class, 'getFloors']);

    Route::post('/generate-housekeeping-report', [NonRevenueController::class, 'houseKeepingGenerate']);
    Route::get('/cleaners', [NonRevenueController::class, 'getCleaner']);
    Route::get('/cleaning-statuses', [NonRevenueController::class, 'getCleaningStatus']);

    Route::post('/generate-maintenance-report', [NonRevenueController::class, 'maintenaceGenerate']);
    Route::get('/maintenance-types', [NonRevenueController::class, 'GetMaintenanceMaster']);
    Route::get('/maintenance-statuses', [NonRevenueController::class, 'getMaintenanceStatusMaster']);

    Route::post('/generate-blocking-report', [NonRevenueController::class, 'blockReportGenerate']);
    Route::get('/block-reasons', [NonRevenueController::class, 'getBlockReasons']);
    Route::get('/room-blockers', [NonRevenueController::class, 'getRoomBlockers']);

    Route::post('/generate-guest-forecast', [NonRevenueController::class, 'guestforecastgenerate']);
    

    Route::get('/getAllActiveRooms', [DashboardController::class, 'getAllActiveRooms']);
    Route::get('/getArrivalModes', [CheckinController::class, 'getArrivalModes']);
    Route::get('/getAllGender', [CheckinController::class, 'getAllGender']);
    Route::get('/getAllTitleMaster', [CheckinController::class, 'getAllTitleMaster']);
    Route::get('/getAllRoomTypes', [CheckinController::class, 'getAllRoomTypes']);
    Route::get('/getAllSegments', [CheckinController::class, 'getAllSegments']);
    Route::get('/getAllBusinessSources', [CheckinController::class, 'getAllBusinessSources']);
    Route::get('/getRoomsByType/{roomTypeId}', [CheckinController::class, 'getRoomsByType']);
    Route::get('/getRoomTypePlan/{roomTypeId}', [CheckinController::class, 'getRoomTypePlan']);

    Route::post('/checkinConfirm', [CheckinController::class, 'checkinConfirm']);
    Route::get('/checkinList', [CheckinController::class, 'checkinList']);
    Route::get('/checkin/{checkinid}', [CheckinController::class, 'checkin']);
    Route::put('/editcheckin/{checkinId}', [CheckinController::class, 'editCheckin']);

    Route::get('/checkindetails/{checkinId}', [CheckoutController::class, 'getCheckinDetails']);
    Route::get('/checkinroomdetails/{checkinId}/{roomId}', [CheckoutController::class, 'getCheckinRoomDetails']);

    Route::post('/clean-room', [RoommenuController::class, 'cleanRoom']);
    Route::post('/finish-cleaning', [RoommenuController::class, 'finishCleaning']);
    Route::get('/cleaning-masters', [RoommenuController::class, 'getCleaningMasters']);

    Route::post('/report-maintenance', [RoommenuController::class, 'reportMaintenance']);
    Route::post('/resolve-maintenance', [RoommenuController::class, 'resolveMaintenance']);
    Route::get('/maintenance-masters', [RoommenuController::class, 'getMaintenanceMasters']);

    Route::get('/checkin-info', [RoommenuController::class, 'getCheckInInfo']);

});
// Routes protected by sanctum auth
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Public routes for check-in and room data

