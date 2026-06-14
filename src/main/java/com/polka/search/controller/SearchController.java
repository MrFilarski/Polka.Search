package com.polka.search.controller;

import com.polka.search.model.SearchCriteria;
import com.polka.search.model.SearchResult;
import com.polka.search.model.BusinessUpdate;
import com.polka.search.service.SearchDataService;
import com.polka.search.service.SearchService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Controller
public class SearchController {

    private final SearchDataService dataService;
    private final SearchService searchService;

    public SearchController(SearchDataService dataService, SearchService searchService) {
        this.dataService = dataService;
        this.searchService = searchService;
    }

    @GetMapping("/")
    public String search(@ModelAttribute("criteria") SearchCriteria criteria, Model model) {
        if (criteria.getRadius() == null) {
            criteria.setRadius(10);
        }
        if (criteria.getLatitude() == null || criteria.getLongitude() == null) {
            criteria.setLatitude(52.2297);
            criteria.setLongitude(21.0122);
        }

        List<SearchResult> results = searchService.search(criteria, dataService);
        List<BusinessUpdate> latestUpdates = generateMockUpdates();
        
        model.addAttribute("results", results);
        model.addAttribute("resultCount", results.size());
        model.addAttribute("latestUpdates", latestUpdates);
        return "search";
    }

    private List<BusinessUpdate> generateMockUpdates() {
        List<BusinessUpdate> updates = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        updates.add(new BusinessUpdate(
            "Café Artisan",
            "Coffee",
            "🎉 New summer menu available! Try our fresh iced lattes and refreshing smoothie bowls.",
            "event",
            now.minusHours(2),
            142
        ));
        
        updates.add(new BusinessUpdate(
            "Pizza Napoli",
            "Restaurant",
            "🎯 50% OFF on all pizzas every Tuesday! Come and enjoy authentic Italian flavors.",
            "deal",
            now.minusHours(4),
            89
        ));
        
        updates.add(new BusinessUpdate(
            "City Gym",
            "Fitness",
            "📅 New yoga classes starting next week! Sign up now for 3 free trial sessions.",
            "event",
            now.minusHours(6),
            210
        ));
        
        updates.add(new BusinessUpdate(
            "The Book Corner",
            "Bookstore",
            "📰 Best sellers are now 30% off. Find your next favorite book in our curated collection!",
            "news",
            now.minusHours(8),
            65
        ));
        
        updates.add(new BusinessUpdate(
            "Fresh Market",
            "Grocery",
            "🎯 Weekend special: Buy 2, Get 1 Free on all organic vegetables. Limited time offer!",
            "deal",
            now.minusHours(10),
            178
        ));
        
        updates.add(new BusinessUpdate(
            "Tech Hub",
            "Electronics",
            "📅 Grand opening this Saturday! Join us for free tech workshops and exclusive launch discounts.",
            "event",
            now.minusHours(12),
            312
        ));
        
        return updates;
    }
}
