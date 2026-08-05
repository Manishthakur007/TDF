package com.foodblog.config;

import com.foodblog.model.*;
import com.foodblog.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepo;
    @Autowired private CategoryRepository categoryRepo;
    @Autowired private PostRepository postRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) return;

        // Create categories
        Category streetFood = createCategory("Street Food", "street-food", "Delicious bites from the streets", "🌮", "#FF6B35");
        Category recipes = createCategory("Recipes", "recipes", "Step-by-step cooking guides", "👨‍🍳", "#4ECDC4");
        Category healthy = createCategory("Healthy", "healthy", "Nutritious & delicious meals", "🥗", "#45B7D1");
        Category desserts = createCategory("Desserts", "desserts", "Sweet treats and indulgences", "🍰", "#F7B731");
        List<Category> categories = List.of(streetFood, recipes, healthy, desserts);
        categoryRepo.saveAll(categories);

        // Create admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@foodblog.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        admin.setAvatar("https://api.dicebear.com/7.x/initials/svg?seed=Admin");
        admin.setBio("Chief editor and food enthusiast");
        userRepo.save(admin);

        // Create sample user
        User user1 = new User();
        user1.setUsername("foodiechef");
        user1.setEmail("chef@foodblog.com");
        user1.setPassword(passwordEncoder.encode("password123"));
        user1.setRole(User.Role.USER);
        user1.setAvatar("https://api.dicebear.com/7.x/initials/svg?seed=FoodieChef");
        userRepo.save(user1);

        // Create seed posts
        createPost("The Ultimate Pav Bhaji Recipe", "pav-bhaji-recipe", recipes, admin,
            "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=800",
            "<p>Pav Bhaji is one of India's most beloved street foods — a rich, spicy vegetable mash served with buttery toasted bread rolls. This recipe walks you through achieving that authentic Mumbai flavor right in your kitchen.</p><h2>Ingredients</h2><ul><li>500g mixed vegetables (potato, cauliflower, peas)</li><li>2 tbsp butter</li><li>2 onions, finely chopped</li><li>3 tomatoes, pureed</li><li>2 tbsp Pav Bhaji masala</li><li>Salt to taste</li></ul><h2>Method</h2><p>Boil and mash the vegetables. In a pan, heat butter and sauté onions until golden. Add tomato puree and cook until oil separates. Add masala and mashed vegetables. Cook on high heat, mashing continuously. Serve hot with buttered pav.</p>",
            "The most authentic Pav Bhaji recipe with the secret Mumbai-style technique for that perfect flavor.");

        createPost("Top 5 Street Foods in Delhi You Must Try", "top-5-delhi-street-foods", streetFood, admin,
            "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800",
            "<p>Delhi's street food scene is legendary. From the smoky kebabs of Chandni Chowk to the tangy chaat of Connaught Place, this city is a paradise for food lovers.</p><h2>1. Aloo Chaat</h2><p>Crispy fried potatoes tossed in a mix of tamarind chutney, chili, and chaat masala. The perfect balance of sweet, sour, and spicy.</p><h2>2. Paranthe Wali Gali</h2><p>This narrow lane in old Delhi is famous for its stuffed paranthas cooked in pure ghee. Flavors range from classic potato to exotic rabri.</p><h2>3. Chole Bhature</h2><p>Fluffy deep-fried bread served with spicy chickpea curry. A Delhi breakfast staple that will keep you full all day.</p>",
            "A food lover's guide to the best street eats in Delhi, from chaat to kebabs.");

        createPost("Green Smoothie Bowl for a Healthy Start", "green-smoothie-bowl", healthy, admin,
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
            "<p>Start your morning with this vibrant, nutrient-packed green smoothie bowl. It's as beautiful as it is healthy!</p><h2>Ingredients</h2><ul><li>2 frozen bananas</li><li>1 cup spinach</li><li>1/2 cup mango chunks</li><li>1/2 cup coconut milk</li></ul><h2>Toppings</h2><ul><li>Granola</li><li>Fresh berries</li><li>Chia seeds</li><li>Coconut flakes</li></ul><h2>Instructions</h2><p>Blend all smoothie ingredients until smooth and thick. Pour into a bowl and arrange toppings artfully. Serve immediately and enjoy!</p>",
            "This gorgeous green smoothie bowl is packed with vitamins and tastes like a tropical vacation.");

        createPost("Classic Chocolate Lava Cake", "chocolate-lava-cake", desserts, user1,
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800",
            "<p>Nothing beats the magic of cutting into a chocolate lava cake and watching that warm, molten chocolate flow out. This recipe is foolproof and comes together in just 20 minutes!</p><h2>Ingredients</h2><ul><li>100g dark chocolate</li><li>100g butter</li><li>2 eggs + 2 yolks</li><li>80g sugar</li><li>50g flour</li></ul><h2>Method</h2><p>Melt chocolate and butter together. Whisk eggs and sugar until pale. Fold in chocolate mixture and flour. Pour into greased ramekins and bake at 200°C for 12 minutes. The center should still be jiggly. Let rest 1 minute then invert onto plates.</p>",
            "The ultimate chocolate lava cake — crispy outside, molten chocolatey inside — ready in 20 minutes.");

        createPost("Mumbai Vada Pav: The People's Burger", "mumbai-vada-pav", streetFood, user1,
            "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800",
            "<p>Vada Pav is Mumbai's soul food. This humble yet iconic snack — a spiced potato fritter in a bread roll — is sold at every street corner and loved by all.</p><h2>For the Vada</h2><ul><li>4 boiled potatoes, mashed</li><li>1 tsp mustard seeds</li><li>Curry leaves, green chili, ginger</li><li>Turmeric, salt</li></ul><h2>For the batter</h2><ul><li>1 cup besan (gram flour)</li><li>Turmeric, red chili powder, salt</li></ul><p>Prepare the potato filling with the tempering. Shape into balls, coat in batter and deep-fry until golden. Serve in pav with green chutney and tamarind chutney.</p>",
            "Make Mumbai's most iconic street food at home — crispy, spicy, and absolutely addictive.");

        createPost("Quinoa Buddha Bowl with Tahini Dressing", "quinoa-buddha-bowl", healthy, user1,
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
            "<p>This colorful Buddha bowl is a complete meal that checks every nutritional box. Protein-rich quinoa, roasted veggies, and a creamy tahini dressing make this a weekday winner.</p><h2>Base</h2><ul><li>1 cup quinoa, cooked</li></ul><h2>Roasted Veggies</h2><ul><li>Chickpeas, sweet potato, broccoli</li><li>Olive oil, cumin, paprika</li></ul><h2>Tahini Dressing</h2><ul><li>3 tbsp tahini, juice of 1 lemon, garlic, water</li></ul><p>Roast veggies at 200°C for 25 minutes. Assemble bowl with quinoa, veggies, avocado, and drizzle with tahini dressing.</p>",
            "A gorgeous, nutritious Buddha bowl that's meal-prep friendly and endlessly customizable.");

        System.out.println("✅ Seed data created successfully!");
        System.out.println("   Admin: admin@foodblog.com / admin123");
        System.out.println("   User: chef@foodblog.com / password123");
    }

    private Category createCategory(String name, String slug, String desc, String icon, String color) {
        Category c = new Category();
        c.setName(name);
        c.setSlug(slug);
        c.setDescription(desc);
        c.setIcon(icon);
        c.setColor(color);
        return c;
    }

    private void createPost(String title, String slug, Category category, User author,
                             String imageUrl, String content, String excerpt) {
        Post p = new Post();
        p.setTitle(title);
        p.setSlug(slug);
        p.setCategory(category);
        p.setAuthor(author);
        p.setImageUrl(imageUrl);
        p.setContent(content);
        p.setExcerpt(excerpt);
        p.setStatus(Post.Status.PUBLISHED);
        p.setViews((int)(Math.random() * 1000 + 100));
        postRepo.save(p);
    }
}
