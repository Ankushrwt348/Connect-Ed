package com.Connect_Ed.backend.Entity.DTO;

public class CommentRequest {
    private String content;
    private Long parentCommentId;

    // getters and setters
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Long getParentCommentId() { return parentCommentId; }
    public void setParentCommentId(Long parentCommentId) { this.parentCommentId = parentCommentId; }
}

