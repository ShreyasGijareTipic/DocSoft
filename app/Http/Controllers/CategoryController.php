<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\SubSubCategory;
use DB;
use App\Helpers\Util;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Category::all(); 
    }

    /**
     * Display a all available categories and sub categories.
     *
     * @return \Illuminate\Http\Response
     */
    public function categories()
    {
        $categories = Category::where('show', true)->get();
        $subCategory = SubCategory::where('show', true)->get();
        $subSubCategory = SubSubCategory::where('show', true)->get();

        $mappedCategories = array();
        foreach($categories as $category){
            $subCategories = Util::getFilteredArray($category->id,$subCategory,'categoryId');
            foreach($subCategories as $subCategory){
                $subCategory->subSubCategory = Util::getFilteredArray($subCategory->id,$subSubCategory,'subCategoryId');
            }
            $category->subCategory = $subCategories;
            array_push($mappedCategories, $category);
        }
        return $mappedCategories;
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
            'localName'=> 'required',
            'image'=> 'required',
            'show'=> 'required'
        ]);
        return Category::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Category::find($id); 
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
        $request->validate([
            'name'=> 'required',
            'localName'=> 'required',
            'image'=> 'required',
            'show'=> 'required'
        ]);

        $category = Category::find($id);
        $category->update($request->all());
        return $category;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Category::destroy($id);
    }
}
