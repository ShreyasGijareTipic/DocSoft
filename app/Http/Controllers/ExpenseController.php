<?php
namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    protected $user;
      
    public function __construct()
    {   
        $this->user = Auth::user();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {    $user=Auth::user();
     
        $userId = $user->id;
        $ComapanyId = $user->company_id;
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');

        $query = Expense::where('company_id', $ComapanyId);

        if ($startDate && $endDate) {
            $query->whereBetween('expense_date', [$startDate, $endDate])
                  ->where('created_by', $userId) ;
        }
        //  echo($query);
       
        return $query->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = Auth::user();


        $request->validate([
            'name' => 'required|string',
            'expense_date' => 'required|date',
            'price' => 'required|integer|min:0',
            'qty' => 'required|integer|min:0',
            'total_price' => 'required|integer|min:0',
            'show' => 'required|boolean',
        ]);

        $expStore = Expense::create([
            'name' => $request->name,
            'expense_date' => $request->expense_date,
            'price' => $request->price,
            'qty' => $request->qty,
            'total_price' => $request->total_price,
            'show' => $request->show,
            'company_id' => $user->company_id, // Set company_id based on the authenticated user
            'user_id' => $user->id, // Optionally store user ID if needed
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Expense created successfully.',
            'expense' => $expStore,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $company_id = $this->user->company_id;

        $expense = Expense::where('id', $id)->where('company_id', $company_id)->first();

        if (!$expense) {
            return response()->json(['message' => 'Expense not found'], 404);
        }

        return $expense;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $company_id = $this->user->company_id;

        $request->validate([
            'name' => 'required|string',
            'expense_date' => 'required|date',
            'price' => 'required|integer|min:0',
            'qty' => 'required|integer|min:0',
            'total_price' => 'required|integer|min:0',
            'show' => 'required|boolean',
        ]);

        $expense = Expense::where('id', $id)->where('company_id', $company_id)->first();

        if (!$expense) {
            return response()->json(['message' => 'Expense not found'], 404);
        }

        $expense->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Expense updated successfully.',
            'expense' => $expense,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $company_id = $this->user->company_id;

        $expense = Expense::where('id', $id)->where('company_id', $company_id)->first();

        if (!$expense) {
            return response()->json(['message' => 'Expense not found'], 404);
        }

        $expense->delete();

        return response()->json([
            'success' => true,
            'message' => 'Expense deleted successfully.',
        ]);
    }
}
