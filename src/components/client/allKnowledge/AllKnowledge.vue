<template>
    <div class="comments">
      <h3>评论区</h3>
      <el-form :model="commentForm" label-width="80px" class="comment-form">
        <el-form-item label="姓名">
          <el-input v-model="commentForm.name"></el-input>
        </el-form-item>
        <el-form-item label="评论">
          <el-input v-model="commentForm.comment"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addComment">发布评论</el-button>
        </el-form-item>
      </el-form>
      <div class="comment-list">
        <div v-for="(comment, index) in comments" :key="index" class="comment">
          <div class="name">{{ comment.name }}</div>
          <div class="content">{{ comment.comment }}</div>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        commentForm: {
          name: '',
          comment: ''
        },
        comments: [
          { name: '小明', comment: '这个评论区很不错！' },
          { name: '小红', comment: '我也觉得很好！' }
        ]
      }
    },
    methods: {
      addComment() {
        const { name, comment } = this.commentForm
        if (name && comment) {
          this.comments.push({ name, comment })
          this.commentForm.name = ''
          this.commentForm.comment = ''
        } else {
          this.$message.error('请填写姓名和评论内容')
        }
      }
    }
  }
  </script>
  <style scoped>
  .comments {
    margin: 20px;
  }
  .comment-form {
    margin-bottom: 20px;
  }
  .comment {
    margin-bottom: 10px;
  }
  .name {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .content {
    margin-left: 20px;
  }
  </style>
