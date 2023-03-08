import { mount } from "@vue/test-utils";
import Login from "@/general/views/Login.vue";

describe("Login.vue", () => {
  it("renders Login page", () => {
    const wrapper = mount(Login);
    expect(wrapper.text()).toMatch("Log In");
  });
});
