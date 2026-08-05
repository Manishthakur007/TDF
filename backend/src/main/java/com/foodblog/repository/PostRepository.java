package com.foodblog.repository;

import com.foodblog.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findBySlug(String slug);

    Page<Post> findByStatus(Post.Status status, Pageable pageable);

    Page<Post> findByCategorySlugAndStatus(String categorySlug, Post.Status status, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.status = 'PUBLISHED' AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Post> searchPublished(@Param("query") String query, Pageable pageable);

    long countByStatus(Post.Status status);

    @Query("SELECT p FROM Post p WHERE p.status = 'PUBLISHED' ORDER BY p.views DESC")
    Page<Post> findTopByViews(Pageable pageable);
}
