<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MenuSection;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        $menu = MenuSection::with(['items.subChildren.subChildren'])
            ->orderBy('display_order')
            ->get()
            ->map(function ($section) {
                return [
                    'section' => $section->name,
                    'items' => $section->items->map(function ($item) {
                        return $this->formatMenuItem($item);
                    })
                ];
            });
            
        return response()->json($menu);
    }
    
    protected function formatMenuItem($item)
    {
        $formatted = [
            'name' => $item->name,
            'icon' => $item->icon,
            'path' => $item->path,
            'action' => $item->action,
        ];
        
        if ($item->children->isNotEmpty()) {
            $formatted['submenu'] = $item->children->map(function ($child) {
                return $this->formatMenuItem($child);
            });
        }
        
        return $formatted;
    }
}