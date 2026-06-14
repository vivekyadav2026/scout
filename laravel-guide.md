# Laravel Integration Guide

This guide explains how to convert these static HTML and Tailwind CSS templates into a dynamic Laravel application with modular Blade templates.

## 1. Setup Blade Layout (`resources/views/layouts/app.blade.php`)

Extract the shared HTML skeleton (headers, scripts, footer skeleton) into a master layout.

```html
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Organization Name')</title>
    
    <!-- Meta Tags for SEO -->
    <meta name="description" content="@yield('meta_description', 'Organization description.')">
    
    <!-- Favicon -->
    <link rel="icon" type="image/jpeg" href="{{ asset('assets/logo.jpg') }}">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Tailwind CSS (We recommend installing via npm, but you can retain CDN for rapid prototyping) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        scoutGreen: {
                            DEFAULT: '#0B5D1E',
                            light: '#1B8A3C',
                            dark: '#063811',
                            lightest: '#f0fdf4'
                        },
                        scoutGold: {
                            DEFAULT: '#F4B400',
                            light: '#ffc83b',
                            dark: '#c18f00',
                            lightest: '#fffbeb'
                        },
                        charcoal: '#1F2937',
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        display: ['Outfit', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    @yield('styles')
</head>
<body class="font-sans text-charcoal bg-[#F8FAFC] dark:bg-slate-950 dark:text-slate-100 overflow-x-hidden transition-colors duration-300">

    <!-- Header Partial -->
    @include('partials.header')

    <!-- Main Content Dynamic Section -->
    <main>
        @yield('content')
    </main>

    <!-- Footer Partial -->
    @include('partials.footer')

    <!-- Floating Buttons (WhatsApp, Call, Scroll to Top, Dark Mode) -->
    @include('partials.floating-buttons')

    <!-- Scripts -->
    <script src="{{ asset('js/main.js') }}"></script>
    @yield('scripts')
</body>
</html>
```

---

## 2. Shared Partials

Extract common sections into layout partials under `resources/views/partials/`:
* `header.blade.php`: Contains the navigation bar (`<header>...</header>`). Replace hardcoded navigation links with route links: `href="{{ route('home') }}"`, `href="{{ route('about') }}"`, etc.
* `footer.blade.php`: Contains the newsletter and contact links footer (`<footer>...</footer>`).
* `floating-buttons.blade.php`: Contains the floating widgets (WhatsApp, Call, Dark mode toggle, Back to top).

---

## 3. Creating Page Views (Example: `resources/views/about.blade.php`)

For each individual page, extend the master layout and place the page-specific sections inside the `@section('content')` block.

```html
@extends('layouts.app')

@section('title', 'About Us - Youth Development Organization')
@section('meta_description', 'Learn about our history, mission, vision, and organizational structure.')

@section('content')
    <!-- Place the page-specific content of about.html here -->
    <section class="py-16">
        <div class="max-w-7xl mx-auto px-4">
            <h1 class="text-3xl font-extrabold text-scoutGreen">Our Legacy</h1>
            <!-- Content -->
        </div>
    </section>
@endsection
```

---

## 4. Web Routes Configuration (`routes/web.php`)

Map clean URLs to controller actions:

```php
use App\Http\Controllers\PageController;
use App\Http\Controllers\MembershipController;
use Illuminate\Support\Facades\Route;

// Public Static & Dynamic Pages
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/activities', [PageController::class, 'activities'])->name('activities');
Route::get('/camps-training', [PageController::class, 'campsTraining'])->name('camps');
Route::get('/events', [PageController::class, 'events'])->name('events');
Route::get('/gallery', [PageController::class, 'gallery'])->name('gallery');
Route::get('/downloads', [PageController::class, 'downloads'])->name('downloads');
Route::get('/notices', [PageController::class, 'notices'])->name('notices');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');

// Membership Portal & Dashboard
Route::get('/membership', [MembershipController::class, 'index'])->name('membership');
Route::post('/membership/register', [MembershipController::class, 'register'])->name('membership.register');
Route::post('/membership/login', [MembershipController::class, 'login'])->name('membership.login');
Route::get('/membership/dashboard', [MembershipController::class, 'dashboard'])->name('membership.dashboard')->middleware('auth');
```

---

## 5. CMS Field Mapping

To bind custom administration panel (CMS) inputs:
1. In your HTML blade files, output variables inside double curly brackets: `{{ $page->welcome_title }}`.
2. In each template, we have designated fields with comment tags like `<!-- CMS: About Welcome Text -->` to show where CMS fields should be injected.
