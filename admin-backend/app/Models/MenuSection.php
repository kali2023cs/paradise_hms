<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuSection extends Model
{
    protected $connection = 'mysql2';
    protected $fillable = ['name', 'display_order'];
    
    public function items()
    {
        return $this->hasMany(MenuItem::class, 'section_id')->whereNull('parent_id');
    }
}