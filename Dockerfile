# Sử dụng image Node.js chính thức
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json trước để cài đặt dependencies
COPY package*.json ./

# Cài dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Expose port ứng dụng (ví dụ: 3000)
EXPOSE 3000

# Command chạy ứng dụng
CMD ["node", "index.js"]
