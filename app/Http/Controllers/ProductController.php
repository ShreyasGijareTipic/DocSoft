<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductMedia;
use App\Models\ProductSize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\Util;

class ProductController extends Controller
{
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::all();
        $medias = ProductMedia::all();
        $sizes = ProductSize::all();

        $newProducts = array();
        foreach($products as $product){
            $product->media = Util::getFilteredArray($product->id,$medias,'product_id');
            $product->sizes = Util::getFilteredArray($product->id,$sizes,'product_id');
            array_push($newProducts, $product);
        }
        return $newProducts;
    }
    /**
     * Display a all available products.
     *
     * @return \Illuminate\Http\Response
     */
    public function products()
    {
        $products = Product::where('show', true)->get();
        $medias = ProductMedia::where('show', 1)->get();
        $sizes = ProductSize::where('show', 1)->get();

        $newProducts = array();
        foreach($products as $product){
            $product->media = Util::getFilteredArray($product->id,$medias,'product_id');
            $product->sizes = Util::getFilteredArray($product->id,$sizes,'product_id');
            array_push($newProducts, $product);
        }
        return $newProducts;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'=> 'required',
            'slug'=> 'required',
            'categoryId'=> 'required',
            'incStep'=> 'required',
            'desc'=> 'nullable',
            'multiSize'=> 'required',
            'show'
        ]);
        $product = Product::create($request->all());
        //Save images
        $images = array();
        foreach($request->media as $img){
            $media = new ProductMedia;
            $media->url = $img['url'];
            $media->type = $img['type'];
            //$media->save();
            array_push($images, $media);
        }

        $product->media = $product->media()->saveMany($images);

        $sizes = array();
        foreach($request->sizes as $size){
            //print_r($img);
            $sz = new ProductSize;
            $sz->name = $size['name'];
            $sz->localName = $size['localName'];
            $sz->oPrice = $size['oPrice'];
            $sz->bPrice = $size['bPrice'];
            if($size['dPrice']){
                $sz->dPrice = $size['dPrice'];
            }
            $sz->qty = $size['qty'];
            $sz->show = $size['show'];
            array_push($sizes, $sz);
        }
        $product->sizes = $product->size()->saveMany($sizes);
        return $product;
    }

    /**
     * Store a new stock
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function newStock(Request $request)
    {
        //newStock
        $sizes = array();
        foreach($request->products as $product){
            foreach($product['sizes'] as $size){
                if(isset($size['id']) && isset($size['newStock'])){
                    ProductSize::where('id', $size['id'])
                    ->update([
                        'qty'=> DB::raw('qty+'.$size['newStock'])
                    ]);
                }
            }
        }
        return true;
    }

    /**
     * Store a new stock
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function lowStock(Request $request)
    {
        $sizes = array();
        $products = Product::where('show', true)->get();
        $sizes = ProductSize::where('show', 1)->where('qty','<',500)->get();
        $newProducts = array();
        foreach($products as $product){
            $product->sizes = Util::getFilteredArray($product->id,$sizes,'product_id');
            if(count($product->sizes) > 0){
                array_push($newProducts, $product);
            }
        }
        return $newProducts;
    }

    /**
     * Display the specified resource.
     *
     * @param  integer $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::find($id);
        $product->media = $product->media;
        $product->sizes = $product->size;
        return $product;
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
        $product = Product::find($id);
        $product->update($request->all());
        //Save images
        foreach($request->media as $img){
            if(isset($img['id'])){
                $media = ProductMedia::firstOrNew(array('id' => $img['id']));
                $media->id = $img['id'];
                $media->product_id = $img['product_id'];
                $media->url = $img['url'];
                $media->type = $img['type'];
                $media->show = $img['show'];
                $media ->save();
            }else{
                $media = new ProductMedia;
                $media->url = $img['url'];
                $media->type = $img['type'];
                $product->media()->save($media);
            }
        }

        // $sizes = array();
        foreach($request->sizes as $size){
            //print_r($img);
            if(isset($size['id'])){
                $sz = ProductSize::firstOrNew(array('id' => $size['id']));
                $sz->id = $size['id'];
                $sz->product_id = $size['product_id'];
                $sz->name = $size['name'];
                $sz->localName = $size['localName'];
                $sz->oPrice = $size['oPrice'];
                $sz->dPrice = $size['dPrice'];
                $sz->bPrice = $size['bPrice'];
                //$sz->qty = $size['qty'];
                $sz->show = $size['show'];
                $sz->save();
            }else{
                $sz = new ProductSize;
                $sz->name = $size['name'];
                $sz->localName = $size['localName'];
                $sz->oPrice = $size['oPrice'];
                $sz->dPrice = $size['dPrice'];
                $sz->qty = $size['qty'];
                $sz->show = $size['show'];
                $product->sizes = $product->size()->save($sz);
            }
        }
        
        return $product;
    }


    public function updateQty(Request $request)
{
    // Validate request inputs
    $request->validate([
        'id' => 'required|exists:product_sizes,id',
        'qty' => 'required|integer|min:0',
        // 'show' => 'nullable|integer'
    ]);

    
    $productSize = ProductSize::find($request->id);
    // $products = Product::find($request->id);

    
    if ($productSize ) {
        // Update quantity if provided
        if ($request->filled('qty')) {
            $productSize->qty = $productSize->qty + $request->qty;
        }
        
        // Update visibility if provided
        // if ($request->filled('show')) {
        //     $productSize->show = $request->show;
        // }

        // Save the updated product size
        $productSize->save();
       
        $productSize = ProductSize::find($request->id);

        return response()->json([
            'success' => true,
            'message' => 'Quantity updated successfully.',
            'product' => $productSize,
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Product size not found.'
    ], 404);
}

    



    /**
     * Remove the specified resource from storage.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Product::destroy($id);
    }
}
