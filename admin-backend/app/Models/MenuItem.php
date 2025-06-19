<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $connection = 'mysql2';
    protected $fillable = [
        'section_id', 'parent_id', 'name', 'icon', 
        'path', 'action', 'display_order', 'is_active'
    ];
    
    public function section()
    {
        return $this->belongsTo(MenuSection::class);
    }
    
    public function parent()
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }
    
    public function children()
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->orderBy('display_order');
    }
    
    public function subChildren()
    {
        return $this->children()->with('subChildren');
    }
}